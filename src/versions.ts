export function getVersionId(majorId: number, minorId: number, patchId: number): bigint { 
  const majorIdBigInt = BigInt(majorId);
  const minorIdBigInt = BigInt(minorId);
  const patchIdBigInt = BigInt(patchId);
  return (majorIdBigInt << BigInt(32)) | (minorIdBigInt << BigInt(16)) | patchIdBigInt;
}

export function getMajorMinorPatchFromId(versionId: bigint): {major: number, minor: number, patch: number} {
  const major = Number((versionId >> BigInt(32)) & BigInt(0xFFFF));
  const minor = Number((versionId >> BigInt(16)) & BigInt(0xFFFF));
  const patch = Number(versionId & BigInt(0xFFFF));

  return { major, minor, patch };
}
