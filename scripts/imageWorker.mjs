import { parentPort, workerData } from 'node:worker_threads'
import { access, constants } from 'node:fs/promises'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const { files, workerId } = workerData
const QUALITY = 75

/**
 * Check if a file exists
 * @param {string} filePath File path
 * @returns {Promise<boolean>} True if exists, false otherwise
 */
async function fileExists(filePath) {
  try {
    await access(filePath, constants.F_OK)
    return true
  } catch {
    return false
  }
}

/**
 * Convert a single image to WebP using Sharp
 * @param {string} inputPath Input image path
 */
async function convertToWebP(inputPath) {
  const { dir, name } = parse(inputPath)
  const outputWebPPath = join(dir, `${name}.webp`)

  // Check if .webp file already exists
  if (await fileExists(outputWebPPath)) {
    parentPort.postMessage({
      type: 'result',
      status: 'skipped',
      input: inputPath,
      output: outputWebPPath,
    })
    return
  }

  try {
    const info = await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputWebPPath)

    parentPort.postMessage({
      type: 'result',
      status: 'success',
      input: inputPath,
      output: outputWebPPath,
      size: info.size,
    })
  } catch (err) {
    parentPort.postMessage({
      type: 'result',
      status: 'failed',
      input: inputPath,
      error: err.message,
    })
  }
}

// Process files assigned to this worker
const processFiles = async () => {
  for (const file of files) {
    await convertToWebP(file)
  }
}

processFiles().catch((err) => {
  console.error(`[Worker ${workerId}] Unhandled error during processing:`, err)
})
