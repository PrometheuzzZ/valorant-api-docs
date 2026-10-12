import {endpoints, ValorantEndpoint} from '../../dist'
import * as path from 'node:path'
import {promises as fs} from 'node:fs'
import {deepStrict} from './deepStrict'

(async () => {
    const responsesDir = path.join(__dirname, '..', 'endpoint-responses')
    const responsesDirectories = await fs.readdir(responsesDir)

    const endpointArray = Object.values(endpoints) as ValorantEndpoint[]
    const uncovered: string[] = []
    const usedDirectories = new Set<string>()
    let failures = 0

    for(const endpoint of endpointArray) {
        if(endpoint.responses?.['200'] === undefined) continue

        const slugName = endpoint.name.toLowerCase().replace(/ /g, '-')
        if(!responsesDirectories.includes(slugName)) {
            uncovered.push(slugName)
            continue
        }
        usedDirectories.add(slugName)

        const responseDir = path.join(responsesDir, slugName)
        const responseFiles = await fs.readdir(responseDir)
        const schema = deepStrict(endpoint.responses['200'])

        for(const responseFile of responseFiles.filter(f => f.endsWith('.json'))) {
            const data = JSON.parse(await fs.readFile(path.join(responseDir, responseFile), 'utf-8'))
            const result = schema.safeParse(data)
            if(result.success) {
                console.log(`✅ Parsed ${slugName}/${responseFile}`)
            } else {
                failures++
                console.log(`❌ Failed to parse ${slugName}/${responseFile}`)
                console.error(JSON.stringify(result.error.issues, null, 4))
            }
        }
    }

    const orphaned = responsesDirectories.filter(d => !d.includes('.') && !usedDirectories.has(d))
    if(orphaned.length > 0) {
        failures++
        console.log(`\n❌ Response directories that don't match any endpoint name: ${orphaned.join(', ')}`)
    }

    if(uncovered.length > 0) {
        console.log(`\n⚠️  ${uncovered.length} endpoint(s) have no sample responses in tests/endpoint-responses:`)
        for(const slug of uncovered) console.log(`   - ${slug}`)
    }

    if(failures > 0) {
        console.log(`\n💥 ${failures} failure(s)`)
        process.exit(1)
    }
    console.log('\n🎉 All responses parsed successfully')
})()
