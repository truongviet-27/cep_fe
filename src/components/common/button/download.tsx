/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import DownloadIcon from '@../src/assets/svg/download.svg'
import { type CloneButtonProps } from '@refinedev/antd'
import { useCloneButton } from '@refinedev/core'
import {
  RefineButtonClassNames,
  RefineButtonTestIds,
} from '@refinedev/ui-types'
import { Button } from 'antd'
import Image from 'next/image'
import React from 'react'

/**
 * `<CloneButton>` uses Ant Design's {@link https://ant.design/components/button/ `<Button> component`}.
 * It uses the {@link https://refine.dev/docs/api-reference/core/hooks/navigation/useNavigation#clone `clone`} method from {@link https://refine.dev/docs/api-reference/core/hooks/navigation/useNavigation useNavigation} under the hood.
 * It can be useful when redirecting the app to the create page with the record id route of resource.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/buttons/clone-button} for more details.
 */
export const DownloadButton: React.FC<CloneButtonProps> = ({
  resourceNameOrRouteName: propResourceNameOrRouteName,
  resource: resourceNameFromProps,
  recordItemId,
  hideText = false,
  accessControl,
  meta,
  children,
  onClick,
  ...rest
}) => {
  const { to, LinkComponent, label, disabled, hidden, title } = useCloneButton({
    id: recordItemId,
    resource: resourceNameFromProps ?? propResourceNameOrRouteName,
    accessControl,
    meta,
  })
  const isDisabled = disabled || rest.disabled
  const isHidden = hidden || rest.hidden
  if (isHidden) return null
  return (
    <LinkComponent
      to={to}
      replace={false}
      onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
        if (isDisabled) {
          e.preventDefault()
          return
        }
        if (onClick) {
          e.preventDefault()
          onClick(e)
        }
      }}
    >
      <Button
        icon={<Image src={DownloadIcon} alt="download-icon" />}
        disabled={isDisabled}
        title={title}
        data-testid={RefineButtonTestIds.CloneButton}
        className={RefineButtonClassNames.CloneButton}
        {...rest}
      >
        {!hideText && (children ?? label)}
      </Button>
    </LinkComponent>
  )
}
