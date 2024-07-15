/**
 * Store to retrieve and save debug certificate data.
 * @public
 */
export declare class CertificateStore {
    private _userProfilePath;
    private _serveDataPath;
    private _certificatePath;
    private _keyPath;
    private _certificateData;
    private _keyData;
    constructor();
    /**
     * Path to the saved debug certificate
     */
    get certificatePath(): string;
    /**
     * Debug certificate pem file contents.
     */
    get certificateData(): string | undefined;
    set certificateData(certificate: string | undefined);
    /**
     * Key used to sign the debug pem certificate.
     */
    get keyData(): string | undefined;
    set keyData(key: string | undefined);
}
//# sourceMappingURL=CertificateStore.d.ts.map