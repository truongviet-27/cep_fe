/* eslint-disable @typescript-eslint/no-explicit-any */

import { PlusOutlined } from '@ant-design/icons'
import { useSelect } from '@refinedev/antd'
import { useCreate, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Col, Form, Row, Select, Tag } from 'antd'
import type { KeyboardEvent } from 'react'
import { useRef, useState } from 'react'

import type { SelectedTag, TagModel, TagOption } from './types'

function Tags() {
  const t = useTranslate()
  const [searchValue, setSearchValue] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const creatingTagRef = useRef<string | null>(null) // Prevent duplicate creation
  const form = Form.useFormInstance()
  const selectedTags: SelectedTag[] = form?.getFieldValue('tags') || []

  const { mutate: createTag } = useCreate({
    resource: 'tags',
  })

  const { queryResult } = useSelect({
    resource: 'tags',
    optionLabel: 'name',
    optionValue: 'id',
    pagination: {
      mode: 'server',
      pageSize: 100, // Get more records for client-side filtering
    },
    // Remove onSearch since we're doing client-side filtering
  })

  // Get current options from API
  const baseApiOptions: TagOption[] = (queryResult?.data?.data ?? []).map(
    (item: TagModel) => ({
      label: item.name || '',
      value: item.id || 0,
    }),
  )

  // Use API options directly
  const allOptions: TagOption[] = baseApiOptions

  // Mark selected tags as disabled and grey out
  const apiOptions: TagOption[] = allOptions.map((option: TagOption) => {
    const isSelected = selectedTags.some((tag: SelectedTag) => {
      const tagValue = tag.value
      const optionValue = option.value
      return tagValue === optionValue
    })

    return {
      ...option,
      disabled: isSelected,
      style: isSelected ? { color: '#bfbfbf' } : undefined,
    }
  })

  // Check if search value exists in options (only check non-disabled options)
  const isSearchValueExists = searchValue
    ? apiOptions.some(
        (opt: TagOption) =>
          typeof opt.label === 'string' &&
          opt.label?.toLowerCase().trim() === searchValue.toLowerCase().trim(),
      )
    : false

  // Build final options with create option (no manual filtering)
  const finalOptions: TagOption[] =
    searchValue && searchValue.trim() && !isSearchValueExists
      ? [
          ...apiOptions,
          {
            label: (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: PRIMARY,
                  padding: '4px 0',
                }}
              >
                <PlusOutlined />
                <span>{`"${searchValue}" タグ追加`}</span>
              </div>
            ),
            value: `__create__${searchValue}`,
            key: 'create-new',
          },
        ]
      : apiOptions

  // Smart filterOption that handles both string and JSX labels
  const smartFilterOption = (input: string, option?: TagOption) => {
    // Always show create option
    if (option?.key === 'create-new') return true

    // Handle string labels (normal options)
    if (typeof option?.label === 'string') {
      return option.label.toLowerCase().includes(input.toLowerCase())
    }

    // Fallback - should not happen for normal tags
    return true
  }

  const createNewTag = async (tagName: string) => {
    // Prevent duplicate creation if already creating this tag
    if (creatingTagRef.current === tagName) {
      return
    }

    creatingTagRef.current = tagName
    setIsCreating(true)
    try {
      const result = await new Promise<any>((resolve, reject) => {
        createTag(
          {
            values: { name: tagName, order: null },
          },
          {
            onSuccess: (data: any) => resolve(data),
            onError: (error: any) => reject(error),
          },
        )
      })

      // Refresh the options list to get the new tag from API
      await queryResult.refetch?.()

      // Add the new tag to selected tags
      const newTag: SelectedTag = {
        label: tagName,
        value: result?.data?.id || `temp_${Date.now()}`,
        key: tagName,
      }

      const currentTags: SelectedTag[] = form?.getFieldValue('tags') || []
      const updatedTags = [...currentTags, newTag]
      form?.setFieldsValue({ tags: updatedTags })
    } catch (error) {
      console.error('Error creating tag:', error)
      // Don't add anything on error - just show error and stop
    } finally {
      creatingTagRef.current = null
      setIsCreating(false)
      setSearchValue('')
    }
  }

  const handleTagChange = async (value: SelectedTag) => {
    // Handle create new tag
    if (
      typeof value === 'object' &&
      value.value &&
      typeof value.value === 'string' &&
      value.value.startsWith('__create__')
    ) {
      const tagName = value.value.substring(10) // Remove __create__ prefix
      setSearchValue('') // Clear immediately
      await createNewTag(tagName)
      return
    }

    // Regular selection from existing options - add to existing tags
    if (value && form && !('disabled' in value && value.disabled)) {
      const currentTags: SelectedTag[] = form?.getFieldValue('tags') || []

      // Check if this tag is already selected by comparing value/id
      const isAlreadySelected = currentTags.some((tag: SelectedTag) => {
        const tagValue = tag.value
        const selectedValue = value.value
        return tagValue === selectedValue
      })

      if (!isAlreadySelected) {
        const updatedTags = [...currentTags, value]
        form?.setFieldsValue({ tags: updatedTags })
      }
    }
    setSearchValue('')
  }

  const handleTagRemove = (removedTag: SelectedTag) => {
    const currentTags: SelectedTag[] = form?.getFieldValue('tags') || []
    const updatedTags = currentTags.filter(
      (tag: SelectedTag) => tag.value !== removedTag.value,
    )
    form?.setFieldsValue({ tags: updatedTags })
  }

  const handleKeyDown = async (e: KeyboardEvent<HTMLElement>) => {
    if (
      e.key === 'Enter' &&
      searchValue &&
      !isSearchValueExists &&
      !isCreating
    ) {
      e.preventDefault()
      e.stopPropagation()
      await createNewTag(searchValue)
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          marginBottom: 8,
          fontSize: 16,
          fontWeight: 600,
          borderBottom: '1px solid #d9d9d9',
          color: PRIMARY,
        }}
      >
        {t('quotas.show.tags')}
      </div>

      {/* Display selected tags inline */}
      <div
        style={{
          display: 'flex',
          maxWidth: '50%',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: selectedTags.length > 0 ? 12 : 8,
          minHeight: selectedTags.length > 0 ? 'auto' : 0,
        }}
      >
        {selectedTags.map((tag: SelectedTag, index: number) => (
          <Tag
            key={tag.key || tag.value || index}
            closable
            onClose={() => handleTagRemove(tag)}
            style={{
              borderRadius: 16,
              padding: '4px 12px',
              background: '#f6f6f6',
            }}
          >
            {tag.label || tag.name}
          </Tag>
        ))}
      </div>

      <Row>
        <Col xs={24} md={12}>
          <Form.Item name={'tags'} hidden>
            <Select style={{ display: 'none' }} />
          </Form.Item>

          <Select
            allowClear
            showSearch
            placeholder={t('placeholders.select')}
            style={{ width: '50%' }}
            labelInValue
            filterOption={smartFilterOption} // Use smart filtering
            options={finalOptions}
            value={null}
            loading={isCreating}
            disabled={isCreating}
            onSearch={(value) => {
              setSearchValue(value)
            }}
            onChange={handleTagChange}
            onKeyDown={handleKeyDown}
            dropdownStyle={{
              borderRadius: 8,
            }}
          />
        </Col>
      </Row>
    </div>
  )
}

export default Tags
