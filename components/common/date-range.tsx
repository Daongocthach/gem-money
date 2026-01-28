import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

import RowComponent from '@/components/common/row-component'
import TextComponent, { TextComponentProps } from '@/components/common/text-component'

export default function DateRange({
    textFromProps,
    textToProps,
    date_start,
    date_end,
}: {
    textFromProps?: TextComponentProps,
    textToProps?: TextComponentProps,
    date_start: string | null,
    date_end: string | null,
}) {
    const { t } = useTranslation()

    const convertDateStart = date_start ? format(new Date(date_start), 'MM-dd-yyyy') : 'N/A'
    const convertDateEnd = date_end ? format(new Date(date_end), 'MM-dd-yyyy') : 'N/A'

    return (
        <RowComponent gap={10} wrap>
            <TextComponent
                text={t('from') + ': ' + convertDateStart}
                type='caption'
                fontWeight='medium'
                {...textFromProps}
            />
            <TextComponent
                text={t('to') + ': ' + convertDateEnd}
                type='caption'
                fontWeight='medium'
                {...textToProps}
            />
        </RowComponent>
    )
}
