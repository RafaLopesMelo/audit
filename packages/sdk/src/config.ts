export const getQueueParameterName = (env: string, region: string) => {
    return `/${env}/${region}/audit/sdk`;
};
