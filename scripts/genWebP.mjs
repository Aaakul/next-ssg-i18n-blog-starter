import { Worker, isMainThread } from 'node:worker_threads'
import { readdir, stat } from 'node:fs/promises'
import { join, extname, relative } from 'node:path'
import { cpus } from 'node:os'

// Configuration
const SOURCE_DIR = './public/static/images'
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg']
const CPU_THREADS = cpus().length

/**
 * Recursively get all file paths matching the extensions in the specified directory
 * @param {string} dir Directory path
 * @returns {Promise<string[]>} Array of file paths
 */
async function getAllImageFiles(dir) {
  try {
    const list = await readdir(dir)
    const results = await Promise.all(
      list.map(async (file) => {
        const filePath = join(dir, file)
        const stats = await stat(filePath)

        if (stats.isDirectory()) {
          // Recursively traverse subdirectories
          return getAllImageFiles(filePath)
        } else {
          // Check if file extension matches
          const ext = extname(file).toLowerCase()
          return IMAGE_EXTENSIONS.includes(ext) ? [filePath] : []
        }
      })
    )
    return results.flat()
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message)
    return []
  }
}

/**
 * Distribute file list evenly across multiple worker threads
 * @param {string[]} files File path list
 * @param {number} numWorkers Number of worker threads
 * @returns {Array<string[]>} Array of distributed file lists
 */
function distributeFiles(files, numWorkers) {
  const chunks = Array.from({ length: numWorkers }, () => [])
  files.forEach((file, index) => {
    chunks[index % numWorkers].push(file)
  })
  return chunks
}

if (isMainThread) {
  const run = async () => {
    console.log(`Scanning directory: ${SOURCE_DIR}`)
    const allImageFiles = await getAllImageFiles(SOURCE_DIR)

    if (allImageFiles.length === 0) {
      console.log('No PNG or JPG files found.')
      process.exit(0)
    }
    const workerThreads = Math.min(allImageFiles.length, CPU_THREADS)
    console.log(`Found ${allImageFiles.length} image files.`)
    console.log(`Starting ${workerThreads} worker threads...\n`)

    const fileChunks = distributeFiles(allImageFiles, workerThreads)
    const workers = []
    const startTime = Date.now()

    let totalProcessed = 0
    let totalSkipped = 0
    let totalFailed = 0

    // Create and start worker threads
    for (let i = 0; i < workerThreads; i++) {
      const worker = new Worker(new URL(import.meta.url), {
        workerData: { files: fileChunks[i], workerId: i + 1 },
      })
      workers.push(worker)

      worker.on('message', (data) => {
        if (data.type === 'result') {
          switch (data.status) {
            case 'success':
              totalProcessed++
              break
            case 'skipped':
              totalSkipped++
              break
            case 'failed':
              console.error(`✗ Failed: ${relative('.', data.input)} - ${data.error}`)
              totalFailed++
              break
          }
        }
      })

      worker.on('error', (err) => {
        console.error(`Worker ${i + 1} error:`, err)
      })
    }

    // Wait for all workers to complete
    await Promise.all(
      workers.map((worker) => new Promise((resolve) => worker.once('exit', resolve)))
    )

    const endTime = Date.now()
    const durationSecs = ((endTime - startTime) / 1000).toFixed(2)

    console.log(`--- Image Processing Complete ---`)
    console.log(
      `Total: ${allImageFiles.length}, Success: ${totalProcessed}, Skipped: ${totalSkipped}, Failed: ${totalFailed}`
    )
    console.log(`Duration: ${durationSecs}s\n`)
  }

  run().catch(console.error)
} else {
  // Worker thread logic
  import('./imageWorker.mjs')
}
