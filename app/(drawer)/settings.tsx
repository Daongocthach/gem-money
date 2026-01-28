import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { showAlert, showToast } from '@/alerts'
import {
  ButtonComponent,
  CardContainer,
  ChangeLanguageDropdown,
  ColumnComponent,
  Container,
  IconComponent,
  OTPInput,
  PopupComponent,
  RowComponent,
  SwitchComponent,
  TextComponent,
  TextInputComponent
} from '@/components'
import { VERSION_PATCH } from '@/constants'
import { useCheckAppUpdate } from '@/hooks/use-check-app-update'
import useStore from '@/store'


export default function SettingsScreen() {
  const { t } = useTranslation()
  const {
    darkMode,
    setDarkMode,
    isDevMode,
    setActionName,
    signOut,
    refreshToken,
  } = useStore()

  const [visiblePopup, setVisiblePopup] = useState(false)
  const [visibleDevMode, setVisibleDevMode] = useState(false)
  const [devUrl, setDevUrl] = useState('')
  const [value, onChange] = useState<string[]>(["", "", "", "", "", ""])

  const {
    hasUpdate,
    checking,
    openUpdate,
  } = useCheckAppUpdate()

  const toggleSwitch = () => {
    setDarkMode(!darkMode)
  }

  const toggleSwitchDevMode = () => {
    setVisiblePopup(!visiblePopup)
  }

  const handleDevMode = () => {
    if (value.join('') === '123456') {
      if (isDevMode) {
        setActionName('isDevMode', false)
        showToast('disable_success')
        signOut({ refresh_token: refreshToken })
      } else {
        setActionName('isDevMode', true)
        signOut({ refresh_token: refreshToken })
      }
      setVisiblePopup(false)
    } else {
      showAlert('password_mismatch')
    }
  }

  return (
    <Container isScroll>
      <CardContainer gap={25}>
        <TextComponent type='title' text='system' color='primary' />

        <ColumnComponent gap={20}>
          <ChangeLanguageDropdown viewStyle={{ flexGrow: 1, width: '100%' }} label='language' />
          <RowComponent justify='space-between' alignItems='flex-end'>
            <SwitchComponent
              value={darkMode}
              onToggle={toggleSwitch}
              label='dark mode'
            />
            <IconComponent name={darkMode ? 'Moon' : 'Sun'} />
          </RowComponent>

          {visibleDevMode &&
            <SwitchComponent
              value={isDevMode}
              onToggle={toggleSwitchDevMode}
              label='dev mode'
            />
          }

          {Platform.OS === 'android' &&
            <ButtonComponent
              iconProps={{ name: 'CloudDownload', color: hasUpdate ? 'secondary' : 'icon' }}
              textProps={{
                text: checking
                  ? 'checking update'
                  : hasUpdate
                    ? t('update available') + ' (v1.0.' + (VERSION_PATCH + 1) + ')'
                    : 'up to date',
              }}
              ghost
              disabled={!hasUpdate}
              style={{ alignSelf: 'flex-start' }}
              onPress={openUpdate}
            />
          }

        </ColumnComponent>
      </CardContainer>
      <ButtonComponent
        isIconOnly
        textProps={{
          text: `v1.0.${VERSION_PATCH}`,
          type: 'caption',
          color: 'onCardDisabled'
        }}
        style={{ position: 'absolute', bottom: 20, right: 20 }}
        onPress={() => showAlert('change_company', () => setVisibleDevMode(!visibleDevMode))}
      />
      <PopupComponent
        visible={visiblePopup}
        onClose={() => setVisiblePopup(false)}
        modalTitle='developer mode'
        modalDescription='please enter password'
      >
        <ColumnComponent gap={20}>
          <TextInputComponent
            placeholder='enter developer url'
            value={devUrl}
            onChangeText={setDevUrl}
          />
          <OTPInput
            value={value}
            length={6}
            onChange={onChange}
            hideResend
          />
          <ButtonComponent
            textProps={{ text: 'submit' }}
            onPress={handleDevMode}
          />
        </ColumnComponent>
      </PopupComponent>
    </Container>
  )
}