'use client'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import type {
  ToolbarProps,
  ToolbarSlot,
  TransformToolbarSlot,
} from '@react-pdf-viewer/toolbar'
import React, { useRef } from 'react'

/**
 * Default layout plugin with toolbar that hides:
 * - Zoom in/out, zoom dropdown (CurrentScale), and % selector (Zoom)
 * - Download
 * - Print
 */
export function usePdfViewerLayoutPlugin() {
  const pluginRef = useRef<ReturnType<typeof defaultLayoutPlugin> | null>(null)

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Zoom: () => <></>,
    ZoomIn: () => <></>,
    ZoomOut: () => <></>,
    ZoomInMenuItem: () => <></>,
    ZoomOutMenuItem: () => <></>,
    CurrentScale: () => <></>,
    Download: () => <></>,
    DownloadMenuItem: () => <></>,
    Print: () => <></>,
    PrintMenuItem: () => <></>,
  })

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
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
