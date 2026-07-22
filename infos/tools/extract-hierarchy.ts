/**
 * Maestro hierarchy 전체 덤프 → 의미있는 요소만 추출하는 스크립트
 *
 * 사용법:
 *   maestro hierarchy > raw_dump.json
 *   npx tsx extract-hierarchy.ts raw_dump.json cleaned.json
 *   (출력 경로를 생략하면 stdout으로 출력. PowerShell에서 `>`로 리다이렉트하면
 *    UTF-16으로 저장되니 반드시 출력 경로를 인자로 넘길 것)
 *
 * 필터링 규칙:
 *   다음 중 하나라도 값이 있으면 "의미있는 요소"로 판단해 남김
 *   - text가 비어있지 않음
 *   - accessibilityText가 비어있지 않음
 *   - resource-id가 비어있지 않음
 *   - clickable이 true
 */

import { readFileSync, writeFileSync } from "fs"

type RawNode = {
  attributes?: Record<string, any>
  children?: RawNode[]
  clickable?: boolean
  [key: string]: any
}

type CleanElement = {
  text?: string
  accessibilityText?: string
  resourceId?: string
  bounds?: string
  clickable: boolean
}

function isMeaningful(attrs: Record<string, any> | undefined): boolean {
  if (!attrs) return false
  const text = attrs.text?.trim()
  const a11yText = attrs.accessibilityText?.trim()
  const resourceId = attrs["resource-id"]?.trim()
  const clickable = attrs.clickable === "true" || attrs.clickable === true
  return !!(text || a11yText || resourceId || clickable)
}

function extractElements(node: RawNode, results: CleanElement[] = []): CleanElement[] {
  const attrs = node.attributes

  if (isMeaningful(attrs)) {
    results.push({
      text: attrs!.text || undefined,
      accessibilityText: attrs!.accessibilityText || undefined,
      resourceId: attrs!["resource-id"] || undefined,
      bounds: attrs!.bounds || undefined,
      clickable: attrs!.clickable === "true" || attrs!.clickable === true,
    })
  }

  if (node.children) {
    for (const child of node.children) {
      extractElements(child, results)
    }
  }

  return results
}

// ── 실행 ────────────────────────────────────────────────────────
const inputPath = process.argv[2]
if (!inputPath) {
  console.error("사용법: npx tsx extract-hierarchy.ts <raw_dump.json>")
  process.exit(1)
}

const fileBuffer = readFileSync(inputPath)
const isUtf16LE = fileBuffer[0] === 0xff && fileBuffer[1] === 0xfe
const fileText = isUtf16LE
  ? fileBuffer.toString("utf16le").slice(1)
  : fileBuffer.toString("utf-8").replace(/^﻿/, "")
const raw = JSON.parse(fileText)
const rootNodes = Array.isArray(raw) ? raw : [raw]

const allElements: CleanElement[] = []
for (const root of rootNodes) {
  extractElements(root, allElements)
}

// 시스템 UI 요소(상태바, 배터리 등) 제거 — resource-id에 systemui, navigationBar 등이 포함된 것 필터링
const filtered = allElements.filter((el) => {
  const id = el.resourceId || ""
  return !id.includes("systemui") && !id.includes("navigationBar") && !id.includes("status_bar")
})

const output = JSON.stringify(filtered, null, 2)
const outputPath = process.argv[3]
if (outputPath) {
  writeFileSync(outputPath, output, "utf-8")
} else {
  console.log(output)
}