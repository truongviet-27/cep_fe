import type { ReactNode } from 'react'

/**
 * Tag model
 */
export type TagModel = {
  /**
   * Tag ID
   */
  id?: number
  /**
   * Tag name
   */
  name?: string
  /**
   * Order number for sorting
   */
  order?: number | null
}

/**
 * Tag option for Select component
 */
export type TagOption = {
  label: string | ReactNode
  value: string | number
  key?: string
  disabled?: boolean
  style?: React.CSSProperties
}

/**
 * Selected tag value structure (for ID-only format)
 */
export type SelectedTagId = number

/**
 * Tag display structure (for rendering selected tags)
 */
export type TagDisplay = {
  label: string
  value: string | number
  key?: string
  name?: string
}
