import I18n from 'react-native-i18n'

I18n.fallbacks = true;

I18n.translations = {
    'en': require('./en'),
    'zh': require('./zh')
};

export default I18n;