/* eslint-disable @typescript-eslint/no-explicit-any */

import { PlusOutlined } from '@ant-design/icons'
import { useSelect } from '@refinedev/antd'
import { useCreate, useTranslate } from '@refinedev/core'
import { PRIMARY } from '@utility/color'
import { Col, Form, Row, Select, Tag } from 'antd'
import { useRef, useState } from 'react'

function Tags() {
  const t = useTranslate()
  const [searchValue, setSearchValue] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [updateTrigger, setUpdateTrigger] = useState(0) // Force re-render
  const [newlyCreatedTags, setNewlyCreatedTags] = useState<any[]>([]) // Store newly created tags
  const form = Form.useFormInstance()
  const selectedTags = form?.getFieldValue('tags') || []
  const creatingTagRef = useRef<string | null>(null) // Prevent duplicate creation
  console.log(updateTrigger)

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

  // Get current options from API + newly created tags
  const baseApiOptions = (queryResult?.data?.data ?? []).map((item: any) => ({
    label: item.name,
    value: item.id,
  }))

  // Combine API options with newly created tags - DEDUPLICATE by value
  const allOptions = (() => {
    const combined = [...baseApiOptions, ...newlyCreatedTags]
    const seen = new Set<string | number>()
    return combined.filter((option: any) => {
      const key = option.value
      if (seen.has(key)) {
        console.log('🚫 Removing duplicate option:', option.label)
        return false
      }
      seen.add(key)
      return true
    })
  })()

  // Mark selected tags as disabled and grey out
  const apiOptions = allOptions.map((option: any) => {
    const isSelected = selectedTags.some((tag: any) => {
      const tagValue = tag.value || tag.id
      const optionValue = option.value || option.id
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
        (opt: any) =>
          opt.label?.toLowerCase().trim() === searchValue.toLowerCase().trim(),
      )
    : false

  // Build final options with create option (no manual filtering)
  const finalOptions =
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
  const smartFilterOption = (input: string, option: any) => {
    console.log('filterOption called:', input, option)

    // Always show create option
    if (option?.key === 'create-new') return true

    // Handle string labels (normal options)
    if (typeof option?.label === 'string') {
      return option.label.toLowerCase().includes(input.toLowerCase())
    }

    // Fallback - should not happen for normal tags
    return true
  }

  console.log('Search:', searchValue, 'Total options:', finalOptions.length)

  const createNewTag = async (tagName: string) => {
    // Prevent duplicate creation if already creating this tag
    if (creatingTagRef.current === tagName) {
      console.log('⚠️ Tag already being created:', tagName)
      return
    }

    console.log('🆕 Starting tag creation for:', tagName)
    creatingTagRef.current = tagName
    setIsCreating(true)
    try {
      const result = await new Promise((resolve, reject) => {
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

      // Clear temporary newlyCreatedTags since tag is now in API
      setNewlyCreatedTags((prev) => prev.filter((tag) => tag.label !== tagName))

      // Add the new tag to selected tags
      const newTag = {
        label: tagName,
        value: (result as any)?.data?.id || `temp_${Date.now()}`,
        key: tagName,
      }

      // NO NEED to add to newlyCreatedTags - it's already in API now!
      const currentTags = form?.getFieldValue('tags') || []
      const updatedTags = [...currentTags, newTag]
      form?.setFieldsValue({ tags: updatedTags })
      console.log('✅ Tag added to form:', tagName)

      // Force re-render
      setUpdateTrigger((prev) => prev + 1)
    } catch (error) {
      console.error('Error creating tag:', error)
      // Don't add anything on error - just show error and stop
    } finally {
      creatingTagRef.current = null
      setIsCreating(false)
      setSearchValue('')
    }
  }

  const handleTagChange = async (value: any) => {
    console.log('handleTagChange called:', value)

    // Prevent if already creating a tag
    if (isCreating || creatingTagRef.current) {
      console.log('⚠️ Already creating a tag, ignoring this call')
      return
    }

    // Handle create new tag
    if (
      typeof value === 'object' &&
      value.value &&
      typeof value.value === 'string' &&
      value.value.startsWith('__create__')
    ) {
      const tagName = value.value.substring(10) // Remove __create__ prefix
      console.log('📌 handleTagChange creating tag:', tagName)
      setSearchValue('') // Clear immediately
      await createNewTag(tagName)
      return
    }

    // Regular selection from existing options - add to existing tags
    if (value && form && !value.disabled) {
      const currentTags = form?.getFieldValue('tags') || []

      // Check if this tag is already selected by comparing value/id
      const isAlreadySelected = currentTags.some((tag: any) => {
        const tagValue = tag.value || tag.id
        const selectedValue = value.value || value.id
        return tagValue === selectedValue
      })

      if (!isAlreadySelected) {
        const updatedTags = [...currentTags, value]
        form?.setFieldsValue({ tags: updatedTags })

        // Force re-render
        setUpdateTrigger((prev) => prev + 1)
      }
    }
    setSearchValue('')
  }

  const handleTagRemove = (removedTag: any) => {
    const currentTags = form?.getFieldValue('tags') || []
    const updatedTags = currentTags.filter(
      (tag: any) => tag.value !== removedTag.value,
    )
    form?.setFieldsValue({ tags: updatedTags })

    // Force re-render
    setUpdateTrigger((prev) => prev + 1)
  }

  const handleKeyDown = async (e: any) => {
    if (
      e.key === 'Enter' &&
      searchValue &&
      !isSearchValueExists &&
      !isCreating
    ) {
      console.log('⌨️ handleKeyDown creating tag:', searchValue)
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
        {selectedTags.map((tag: any, index: number) => (
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
              console.log('Search value:', value)
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
