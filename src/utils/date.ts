import formatRelative from "date-fns/formatRelative";
import enUS from "date-fns/locale/en-US";

// https://date-fns.org/docs/I18n-Contribution-Guide#formatrelative
// https://github.com/date-fns/date-fns/blob/master/src/locale/en-US/_lib/formatRelative/index.js
// https://github.com/date-fns/date-fns/issues/1218
// https://stackoverflow.com/questions/47244216/how-to-customize-date-fnss-formatrelative
const formatRelativeLocale = {
    lastWeek: "'Last' eeee",
    yesterday: "'Yesterday'",
    today: "'Today'",
    tomorrow: "'Tomorrow'",
    nextWeek: "'Next' eeee",
    other: "MM/dd/yyyy"
};

const locale = {
    ...enUS,
    formatRelative: (token) => formatRelativeLocale[token]
};

// Remove the time from the default
// https://github.com/date-fns/date-fns/issues/1218#issuecomment-599182307
export const formatRelativeDate = (tomorrow) => {
    return formatRelative(new Date(tomorrow), new Date(), { locale });
};
