import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { showAlert } from '@/alerts'
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

  const toggleSwitch = () => {
    setDarkMode(!darkMode)
  }

  const toggleSwitchDevMode = () => {
    setVisiblePopup(!visiblePopup)
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
            onPress={() => {}}
          />
        </ColumnComponent>
      </PopupComponent>
    </Container>
  )
}