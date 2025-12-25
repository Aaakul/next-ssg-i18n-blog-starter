// A custom adapter to fix Next.js 16 RSC prefetch 404 issue (Issue #85374)
// Also removes empty folders
// https://github.com/vercel/next.js/issues/85374
// Inspired by: https://blog.axiorema.com/engineering/uncurious-case-broken-static-exports-404s-nextjs-16

import fs from 'fs/promises'
import path from 'path'

const RM_EMPTY_DIR = true
const DEBUG = false

const ADAPTER_NAME = 'fix-issue-85374'
const NEXT_PREFIX = '__next.'
const OUTPUT_DIR = process.cwd() + '/out'

function debugLog(...args) {
  if (DEBUG) {
    console.log(`[Adapter: ${ADAPTER_NAME}] DEBUG:`, ...args)
  }
}

/**
 * Checks if a file path represents a potential RSC payload that needs renaming.
 * @param {string} filePath - The absolute path of the file.
 * @returns {boolean} - True if the path matches the problematic pattern.
 */
function isProblematicRscPath(filePath) {
  const components = filePath.split(path.sep)
  const nextIndex = components.findIndex((segment) => segment.startsWith(NEXT_PREFIX))
  // A problematic path has '__next.' and more segments after it.
  return nextIndex >= 0 && nextIndex < components.length - 1
}

/**
 * Converts a nested file path like '.../__next/page/__PAGE__.txt'
 * into a flattened path like '.../__next.page.__PAGE__.txt'.
 * @param {string} filePath - The original file path.
 * @returns {string | null} - The corrected path, or null if no change is needed.
 */
function convertToExpectedFlatPath(filePath) {
  if (!isProblematicRscPath(filePath)) {
    debugLog(`Skipping path (does not match pattern): ${filePath}`)
    return null
  }

  const components = filePath.split(path.sep)
  const nextIndex = components.findIndex((segment) => segment.startsWith(NEXT_PREFIX))

  if (nextIndex === -1 || nextIndex >= components.length - 1) {
    // Should not happen if isProblematicRscPath passed, but defensive check
    debugLog(`Unexpected state for path: ${filePath}. No '__next.' or no segments after.`)
    return null
  }

  // Take components before the '__next.' segment
  const prefixParts = components.slice(0, nextIndex)
  // Join the segments starting from '__next.' with dots
  const suffixFlattened = components.slice(nextIndex).join('.')

  const correctedPath = path.join(...prefixParts, suffixFlattened)

  debugLog(`Converted path: ${filePath} -> ${correctedPath}`)
  return correctedPath
}

/**
 * Recursively removes empty directories starting from the given root.
 * @param {string} dirPath - The path of the directory to start cleaning from.
 */
async function removeEmptyDirs(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })

    // Iterate through entries in the directory
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)

      if (entry.isDirectory()) {
        // Recursively check subdirectory first
        await removeEmptyDirs(fullPath)
      }
    }

    // After processing subdirectories, try to remove the current directory if empty
    try {
      await fs.rmdir(dirPath)
      debugLog(`Removed empty directory: ${dirPath}`)
    } catch (err) {
      // rmdir throws an error if the directory is not empty, which is expected.
      // We ignore this specific error, but log others.
      if (err.code !== 'ENOTEMPTY') {
        console.warn(
          `[Adapter: ${ADAPTER_NAME}] Could not remove directory (not empty or other error): ${dirPath}`,
          err.message
        )
      }
    }
  } catch (err) {
    // Handle errors like directory not found, permission denied, etc.
    console.warn(
      `[Adapter: ${ADAPTER_NAME}] Error accessing directory during cleanup: ${dirPath}`,
      err.message
    )
  }
}

// --- Main Adapter Definition ---
/** @type {import("next").NextAdapter} */
const adapter = {
  name: ADAPTER_NAME,

  /**
   * Executes after the Next.js build is complete.
   * Finds and renames RSC payload files to fix the 404 issue.
   * @param {import("next").NextAdapterArgs} args - Arguments passed by Next.js.
   * @param {import("next").BuildOutputs} args.outputs - The build outputs.
   */
  async onBuildComplete({ outputs }) {
    console.log(`[Adapter: ${ADAPTER_NAME}] Starting post-build process...`)

    if (!outputs || !Array.isArray(outputs.staticFiles)) {
      console.warn(
        `[Adapter: ${ADAPTER_NAME}] No RSC payload files found in outputs or outputs is invalid. Skipping.`
      )
      return
    }

    const staticFiles = outputs.staticFiles
    let renameCount = 0
    let errorCount = 0

    for (const file of staticFiles) {
      const sourcePath = file.filePath

      // Ensure source path is absolute, though it typically should be
      const absoluteSourcePath = path.resolve(sourcePath)
      const targetPath = convertToExpectedFlatPath(absoluteSourcePath)

      if (targetPath) {
        try {
          // Ensure the target directory exists
          const targetDir = path.dirname(targetPath)
          await fs.mkdir(targetDir, { recursive: true })

          // Perform the rename operation
          await fs.rename(absoluteSourcePath, targetPath)
          debugLog(`Renamed: ${absoluteSourcePath} -> ${targetPath}`)
          renameCount++
        } catch (err) {
          console.error(
            `[Adapter: ${ADAPTER_NAME}] Error renaming file: ${absoluteSourcePath} -> ${targetPath}`,
            err.message
          )
          errorCount++
        }
      } else {
        debugLog(`No rename needed for: ${absoluteSourcePath}`)
      }
    }

    console.log(
      `[Adapter: ${ADAPTER_NAME}] ✓ Files renamed: ${renameCount}, ✗ Errors: ${errorCount}.`
    )
    if (RM_EMPTY_DIR) {
      console.log(`[Adapter: ${ADAPTER_NAME}] Starting empty directory cleanup...`)
      await removeEmptyDirs(OUTPUT_DIR)
      console.log(`[Adapter: ${ADAPTER_NAME}] ✓ Empty directory cleanup finished.`)
    } else {
      console.log(`[Adapter: ${ADAPTER_NAME}] ✓ Empty directory cleanup skipped.`)
    }
    console.log(`[Adapter: ${ADAPTER_NAME}] ✓ Process completed.`)
  },
}

export default adapter
