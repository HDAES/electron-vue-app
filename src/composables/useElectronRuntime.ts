import { onMounted, readonly, ref } from 'vue';

type RuntimeVersions = {
  electron: string;
  chrome: string;
  node: string;
};

const FALLBACK_PLATFORM = '-';
const FALLBACK_VERSIONS: RuntimeVersions = {
  electron: '-',
  chrome: '-',
  node: '-'
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return '未知错误';
};

export const useElectronRuntime = () => {
  const platform = ref(FALLBACK_PLATFORM);
  const versions = ref<RuntimeVersions>({ ...FALLBACK_VERSIONS });
  const loading = ref(false);
  const pingResult = ref('');

  const loadRuntimeInfo = () => {
    const api = window.electronAPI;

    if (!api) {
      return;
    }

    platform.value = api.platform;
    versions.value = { ...api.versions };
  };

  const ping = async () => {
    const api = window.electronAPI;

    if (!api) {
      pingResult.value = '未检测到 Electron 环境（请在 Electron 中运行）';
      return;
    }

    loading.value = true;
    pingResult.value = '';

    try {
      pingResult.value = await api.ping();
    } catch (error) {
      pingResult.value = `调用失败: ${getErrorMessage(error)}`;
    } finally {
      loading.value = false;
    }
  };

  onMounted(loadRuntimeInfo);

  return {
    platform: readonly(platform),
    versions: readonly(versions),
    loading: readonly(loading),
    pingResult: readonly(pingResult),
    ping
  };
};
