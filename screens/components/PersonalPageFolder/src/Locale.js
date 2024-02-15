export const displayTitleByLocale = (locale, selectedDate, format) => {
    if(format !== undefined) return selectedDate.clone().format(format)

    switch (locale) {
        case 'en': 
            return selectedDate.clone().format('MMMM YYYY')
        case 'ko':
            return selectedDate.clone().format('YYYY년 M월')
        case 'zh-cn':
            return selectedDate.clone().format('YYYY年 M月')
        default:
            return selectedDate.clone().format('MMMM YYYY')
    }
}