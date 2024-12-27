export const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleString('en-US', { weekday: 'short' })
        + " " + date.toLocaleString('en-US', { month: 'short' })
        + " " + date.getDate()
        + " " + date.toLocaleTimeString('en-US', { hour12: false })
        + " " + date.getFullYear();
}