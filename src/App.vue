<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const platform = ref('-');
const versions = ref({ electron: '-', chrome: '-', node: '-' });
const loading = ref(false);
const pingResult = ref('');

onMounted(() => {
  if (window.electronAPI) {
    platform.value = window.electronAPI.platform;
    versions.value = window.electronAPI.versions;
  }
});

const handlePing = async () => {
  if (!window.electronAPI) {
    pingResult.value = '未检测到 Electron 环境（请在 Electron 中运行）';
    return;
  }

  loading.value = true;
  pingResult.value = '';

  try {
    const res = await window.electronAPI.ping();
    pingResult.value = res;
  } catch (err) {
    pingResult.value = '调用失败: ' + (err as Error).message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b bg-card">
      <div class="mx-auto flex max-w-3xl flex-col gap-2 px-6 py-8">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-semibold tracking-tight">Electron + Vue 3</h1>
          <Badge variant="secondary">shadcn-vue</Badge>
        </div>
        <p class="text-sm text-muted-foreground">
          兼容 Windows 7 的桌面应用模板
        </p>
      </div>
    </header>

    <main class="mx-auto grid max-w-3xl gap-6 px-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle>运行环境</CardTitle>
          <CardDescription>当前 Electron 运行时信息</CardDescription>
        </CardHeader>
        <CardContent>
          <dl class="divide-y">
            <div class="flex items-center justify-between py-3">
              <dt class="text-sm text-muted-foreground">平台</dt>
              <dd class="text-sm font-medium">{{ platform }}</dd>
            </div>
            <div class="flex items-center justify-between py-3">
              <dt class="text-sm text-muted-foreground">Electron</dt>
              <dd class="text-sm font-medium">{{ versions.electron }}</dd>
            </div>
            <div class="flex items-center justify-between py-3">
              <dt class="text-sm text-muted-foreground">Chromium</dt>
              <dd class="text-sm font-medium">{{ versions.chrome }}</dd>
            </div>
            <div class="flex items-center justify-between py-3">
              <dt class="text-sm text-muted-foreground">Node.js</dt>
              <dd class="text-sm font-medium">{{ versions.node }}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>IPC 通信测试</CardTitle>
          <CardDescription>通过 preload 脚本调用主进程</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <Button :disabled="loading" @click="handlePing">
            {{ loading ? '请求中...' : '发送 Ping' }}
          </Button>
          <p
            v-if="pingResult"
            class="rounded-md border px-3 py-2 text-sm"
            :class="pingResult === 'pong' ? 'border-green-200 bg-green-50 text-green-700' : 'border-destructive/20 bg-destructive/5 text-destructive'"
          >
            {{ pingResult }}
          </p>
        </CardContent>
      </Card>
    </main>

    <footer class="border-t py-4 text-center text-xs text-muted-foreground">
      基于 Electron 22.3.27 构建，支持 Windows 7 SP1 及以上
    </footer>
  </div>
</template>
