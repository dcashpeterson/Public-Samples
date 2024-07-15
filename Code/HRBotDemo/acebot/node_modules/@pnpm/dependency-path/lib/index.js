"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPeersFolderSuffix = exports.depPathToFilename = exports.parse = exports.refToRelative = exports.relative = exports.getRegistryByPackageName = exports.refToAbsolute = exports.tryGetPackageId = exports.indexOfPeersSuffix = exports.resolve = exports.isAbsolute = void 0;
const crypto_base32_hash_1 = require("@pnpm/crypto.base32-hash");
const encode_registry_1 = __importDefault(require("encode-registry"));
const semver_1 = __importDefault(require("semver"));
function isAbsolute(dependencyPath) {
    return dependencyPath[0] !== '/';
}
exports.isAbsolute = isAbsolute;
function resolve(registries, resolutionLocation) {
    if (!isAbsolute(resolutionLocation)) {
        let registryUrl;
        if (resolutionLocation[1] === '@') {
            const slashIndex = resolutionLocation.indexOf('/', 1);
            const scope = resolutionLocation.slice(1, slashIndex !== -1 ? slashIndex : 0);
            registryUrl = registries[scope] || registries.default;
        }
        else {
            registryUrl = registries.default;
        }
        const registryDirectory = (0, encode_registry_1.default)(registryUrl);
        return `${registryDirectory}${resolutionLocation}`;
    }
    return resolutionLocation;
}
exports.resolve = resolve;
function indexOfPeersSuffix(depPath) {
    if (!depPath.endsWith(')'))
        return -1;
    let open = 1;
    for (let i = depPath.length - 2; i >= 0; i--) {
        if (depPath[i] === '(') {
            open--;
        }
        else if (depPath[i] === ')') {
            open++;
        }
        else if (!open) {
            return i + 1;
        }
    }
    return -1;
}
exports.indexOfPeersSuffix = indexOfPeersSuffix;
function tryGetPackageId(registries, relDepPath) {
    if (relDepPath[0] !== '/') {
        return null;
    }
    const sepIndex = indexOfPeersSuffix(relDepPath);
    if (sepIndex !== -1) {
        return resolve(registries, relDepPath.substring(0, sepIndex));
    }
    const underscoreIndex = relDepPath.indexOf('_', relDepPath.lastIndexOf('/'));
    if (underscoreIndex !== -1) {
        return resolve(registries, relDepPath.slice(0, underscoreIndex));
    }
    return resolve(registries, relDepPath);
}
exports.tryGetPackageId = tryGetPackageId;
function refToAbsolute(reference, pkgName, registries) {
    if (reference.startsWith('link:')) {
        return null;
    }
    if (!reference.includes('/') || reference.includes('(') && reference.lastIndexOf('/', reference.indexOf('(')) === -1) {
        const registryName = (0, encode_registry_1.default)(getRegistryByPackageName(registries, pkgName));
        return `${registryName}/${pkgName}/${reference}`;
    }
    if (reference[0] !== '/')
        return reference;
    const registryName = (0, encode_registry_1.default)(getRegistryByPackageName(registries, pkgName));
    return `${registryName}${reference}`;
}
exports.refToAbsolute = refToAbsolute;
function getRegistryByPackageName(registries, packageName) {
    if (packageName[0] !== '@')
        return registries.default;
    const scope = packageName.substring(0, packageName.indexOf('/'));
    return registries[scope] || registries.default;
}
exports.getRegistryByPackageName = getRegistryByPackageName;
function relative(registries, packageName, absoluteResolutionLoc) {
    const registryName = (0, encode_registry_1.default)(getRegistryByPackageName(registries, packageName));
    if (absoluteResolutionLoc.startsWith(`${registryName}/`)) {
        return absoluteResolutionLoc.slice(absoluteResolutionLoc.indexOf('/'));
    }
    return absoluteResolutionLoc;
}
exports.relative = relative;
function refToRelative(reference, pkgName) {
    if (reference.startsWith('link:')) {
        return null;
    }
    if (reference.startsWith('file:')) {
        return reference;
    }
    if (!reference.includes('/') || reference.includes('(') && reference.lastIndexOf('/', reference.indexOf('(')) === -1) {
        return `/${pkgName}/${reference}`;
    }
    return reference;
}
exports.refToRelative = refToRelative;
function parse(dependencyPath) {
    // eslint-disable-next-line: strict-type-predicates
    if (typeof dependencyPath !== 'string') {
        throw new TypeError(`Expected \`dependencyPath\` to be of type \`string\`, got \`${
        // eslint-disable-next-line: strict-type-predicates
        dependencyPath === null ? 'null' : typeof dependencyPath}\``);
    }
    const _isAbsolute = isAbsolute(dependencyPath);
    const parts = dependencyPath.split('/');
    if (!_isAbsolute)
        parts.shift();
    const host = _isAbsolute ? parts.shift() : undefined;
    if (parts.length === 0)
        return {
            host,
            isAbsolute: _isAbsolute,
        };
    const name = parts[0][0] === '@'
        ? `${parts.shift()}/${parts.shift()}`
        : parts.shift();
    let version = parts.join('/');
    if (version) {
        let peerSepIndex;
        let peersSuffix;
        if (version.includes('(') && version.endsWith(')')) {
            peerSepIndex = version.indexOf('(');
            if (peerSepIndex !== -1) {
                peersSuffix = version.substring(peerSepIndex);
                version = version.substring(0, peerSepIndex);
            }
        }
        else {
            peerSepIndex = version.indexOf('_');
            if (peerSepIndex !== -1) {
                peersSuffix = version.substring(peerSepIndex + 1);
                version = version.substring(0, peerSepIndex);
            }
        }
        if (semver_1.default.valid(version)) {
            return {
                host,
                isAbsolute: _isAbsolute,
                name,
                peersSuffix,
                version,
            };
        }
    }
    if (!_isAbsolute)
        throw new Error(`${dependencyPath} is an invalid relative dependency path`);
    return {
        host,
        isAbsolute: _isAbsolute,
    };
}
exports.parse = parse;
const MAX_LENGTH_WITHOUT_HASH = 120 - 26 - 1;
function depPathToFilename(depPath) {
    let filename = depPathToFilenameUnescaped(depPath).replace(/[\\/:*?"<>|]/g, '+');
    if (filename.includes('(')) {
        filename = filename
            .replace(/\)$/, '')
            .replace(/(\)\()|\(|\)/g, '_');
    }
    if (filename.length > 120 || filename !== filename.toLowerCase() && !filename.startsWith('file+')) {
        return `${filename.substring(0, MAX_LENGTH_WITHOUT_HASH)}_${(0, crypto_base32_hash_1.createBase32Hash)(filename)}`;
    }
    return filename;
}
exports.depPathToFilename = depPathToFilename;
function depPathToFilenameUnescaped(depPath) {
    if (depPath.indexOf('file:') !== 0) {
        if (depPath[0] === '/') {
            depPath = depPath.substring(1);
        }
        const index = depPath.lastIndexOf('/', depPath.includes('(') ? depPath.indexOf('(') - 1 : depPath.length);
        const name = depPath.substring(0, index);
        if (!name)
            return depPath;
        return `${name}@${depPath.slice(index + 1)}`;
    }
    return depPath.replace(':', '+');
}
function createPeersFolderSuffix(peers) {
    const folderName = peers.map(({ name, version }) => `${name}@${version}`).sort().join(')(');
    return `(${folderName})`;
}
exports.createPeersFolderSuffix = createPeersFolderSuffix;
//# sourceMappingURL=index.js.map