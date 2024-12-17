export default interface CommandLine {
    command?: string;
    result?: React.ReactNode;
    newPath?: string;
    doNotBackToLine?: boolean;
}