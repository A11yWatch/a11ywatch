/*
 * Copyright (c) A11yWatch, LLC. and its affiliates.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 **/
import React, { useState } from 'react'
import { Menu } from '@material-ui/core'

export function TopMenu({
  children,
  anchorEl,
  id,
  ...props
}: {
  children: any
  anchorEl?: any
  id?: string
}) {
  const originProp = {
    vertical: 'top',
    horizontal: 'right',
  }
  return (
    <Menu
      id={id}
      anchorEl={anchorEl}
      anchorOrigin={originProp}
      transformOrigin={originProp}
      keepMounted
      {...props}
    >
      {children}
    </Menu>
  )
}
