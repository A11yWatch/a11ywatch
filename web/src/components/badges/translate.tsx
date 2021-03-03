/*
 * Copyright (c) A11yWatch, LLC. and its affiliates.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 **/
import React, { memo, Fragment } from 'react'
import { IconButton, Tooltip, Typography } from '@material-ui/core'
import { useTranslator } from './utils'
import { makeStyles } from '@material-ui/core/styles'
import GTranslateIcon from '@material-ui/icons/GTranslate'

const useStyles = makeStyles((theme) => ({
  badge: {
    marginLeft: 6,
    marginRight: 6,
    background: 'none',
    pointerEvents: 'auto',
    [theme.breakpoints.down('sm')]: {
      marginRight: 12,
    },
  },
  hidden: {
    border: 0,
    clip: 'rect(1px 1px 1px 1px)',
    clipPath: 'inset(50%)',
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    width: 1,
    height: 1,
  },
}))

const TranslateBadgeMain = ({ inline }: { inline?: boolean }) => {
  const classes = useStyles()
  const { setMessageListener, clickTranslate } = useTranslator()
  const ariaT = 'Translate page using google'
  const iconStyles = { color: '#959da5' }

  if (inline) {
    return (
      <button
        style={{ display: 'flex', alignItems: 'center' }}
        onClick={clickTranslate}
        onMouseOver={setMessageListener}
      >
        <GTranslateIcon style={iconStyles} />
        <Typography
          variant={'subtitle1'}
          style={{ marginLeft: '0.3em', fontSize: '1.05rem' }}
        >
          Translate
        </Typography>
      </button>
    )
  }

  return (
    <Fragment>
      <Tooltip title={'Change language'}>
        <IconButton
          onClick={clickTranslate}
          aria-label={ariaT}
          className={classes.badge}
          onMouseOver={setMessageListener}
        >
          <GTranslateIcon style={iconStyles} />
        </IconButton>
      </Tooltip>
      <div id='google_translate_element' className={classes.hidden} />
    </Fragment>
  )
}

export const TranslateBadge = memo(TranslateBadgeMain)
