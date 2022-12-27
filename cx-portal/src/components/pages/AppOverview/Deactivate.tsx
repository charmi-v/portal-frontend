/********************************************************************************
 * Copyright (c) 2021,2022 Mercedes-Benz Group AG and BMW Group AG
 * Copyright (c) 2021,2022 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import { PageBreadcrumb } from 'components/shared/frame/PageBreadcrumb/PageBreadcrumb'
import {
  Typography,
  PageHeader,
  Cards,
  Checkbox,
  Button,
  Tooltips,
  LoadingButton,
} from 'cx-portal-shared-components'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Box } from '@mui/material'
import { useState } from 'react'
import { useDeactivateAppMutation } from 'features/apps/apiSlice'

export default function Deactivate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const appId = useParams().appId
  const [checked, setChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { state } = useLocation()
  const items: any = state

  const app = items && items.filter((item: any) => item.id === appId)

  const [deactivateApp] = useDeactivateAppMutation()

  const handleSaveClick = async () => {
    setIsLoading(true)
    await deactivateApp(app[0].id)
      .unwrap()
      .then(() =>
        navigate('/appoverview', {
          state: 'deactivate-success',
        })
      )
      .catch((error) =>
        navigate('/appoverview', {
          state: 'deactivate-error',
        })
      )
  }

  return (
    <main>
      <PageHeader title={app[0].title} topPage={true} headerHeight={200}>
        <PageBreadcrumb backButtonVariant="contained" />
      </PageHeader>
      <section>
        <Typography variant="body2" mb={3} align="center">
          {app[0].title}
        </Typography>
        <Typography variant="h2" mb={3} align="center">
          {t('content.deactivate.headerTitle')}
        </Typography>
        <Typography variant="body2" align="center">
          {t('content.deactivate.description')}
        </Typography>
        {app && (
          <>
            <Box sx={{ display: 'flex', margin: '100px 0' }}>
              <Box sx={{ width: '50%' }}>
                <Cards
                  items={app}
                  columns={1}
                  buttonText=""
                  variant="minimal"
                  filledBackground={true}
                  imageSize={'small'}
                />
              </Box>
              <Checkbox
                label={`${t('content.deactivate.checkboxLabel')}`}
                key={app[0].id}
                onChange={(e) =>
                  e.target.checked ? setChecked(true) : setChecked(false)
                }
                sx={{ marginLeft: '60px !important' }}
              />
            </Box>
            <Box sx={{ position: 'relative' }}>
              <Button
                color="secondary"
                size="small"
                onClick={() => navigate('/appoverview')}
              >
                {t('global.actions.cancel')}
              </Button>
              <Tooltips
                tooltipPlacement="bottom-start"
                tooltipText={
                  !checked ? t('content.deactivate.checkboxErrorMsg') : ''
                }
                children={
                  <span style={{ position: 'absolute', right: '10px' }}>
                    {isLoading ? (
                      <LoadingButton
                        size="small"
                        loading={isLoading}
                        variant="contained"
                        onButtonClick={() => {}}
                        loadIndicator="Loading..."
                        label={`${t('global.actions.confirm')}`}
                      ></LoadingButton>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        disabled={!checked}
                        onClick={handleSaveClick}
                      >
                        {t('global.actions.save')}
                      </Button>
                    )}
                  </span>
                }
              />
            </Box>
          </>
        )}
      </section>
    </main>
  )
}
