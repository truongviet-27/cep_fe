'use client'
import type { OpenFile } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import type {
  ToolbarProps,
  ToolbarSlot,
  TransformToolbarSlot,
} from '@react-pdf-viewer/toolbar'
import React, { useRef } from 'react'

/**
 * Default layout plugin with:
 * - Toolbar: only Zoom, Download, Print (all other buttons hidden).
 * - Sidebar: hidden (no thumbnails, bookmarks, attachments).
 */
export function usePdfViewerLayoutPlugin(
  fileNameGenerator?: (file: OpenFile) => string,
) {
  const pluginRef = useRef<ReturnType<typeof defaultLayoutPlugin> | null>(null)
  const fileNameGeneratorRef = useRef(fileNameGenerator)
  fileNameGeneratorRef.current = fileNameGenerator

  // Stable identity across renders; always delegates to the latest
  // fileNameGeneratorRef so the plugin instance used by <Viewer> at mount
  // time still resolves fresh data at download time.
  const stableFileNameGenerator = useRef(
    (file: OpenFile) => fileNameGeneratorRef.current?.(file) ?? file.name,
  ).current

  const empty = () => <></>
  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    CurrentPageInput: empty,
    CurrentPageLabel: empty,
    NumberOfPages: empty,
    GoToFirstPage: empty,
    GoToFirstPageMenuItem: empty,
    GoToLastPage: empty,
    GoToLastPageMenuItem: empty,
    GoToNextPage: empty,
    GoToNextPageMenuItem: empty,
    GoToPreviousPage: empty,
    GoToPreviousPageMenuItem: empty,
    Open: empty,
    OpenMenuItem: empty,
    EnterFullScreen: empty,
    EnterFullScreenMenuItem: empty,
    Rotate: empty,
    RotateBackwardMenuItem: empty,
    RotateForwardMenuItem: empty,
    ShowProperties: empty,
    ShowPropertiesMenuItem: empty,
    SwitchTheme: empty,
    SwitchThemeMenuItem: empty,
    SwitchScrollMode: empty,
    SwitchScrollModeMenuItem: empty,
    SwitchSelectionMode: empty,
    SwitchSelectionModeMenuItem: empty,
    ShowSearchPopover: empty,
  })

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    toolbarPlugin: {
      getFilePlugin: { fileNameGenerator: stableFileNameGenerator },
    },
    renderToolbar: (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
      <Toolbar>
        {(slot) =>
          pluginRef.current!.toolbarPluginInstance.renderDefaultToolbar(
            transform,
          )(slot)
        }
      </Toolbar>
    ),
  })

  pluginRef.current = defaultLayoutPluginInstance
  return defaultLayoutPluginInstance
}
