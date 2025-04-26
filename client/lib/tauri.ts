import { isTauri } from '@tauri-apps/api/core';
import { downloadDir } from '@tauri-apps/api/path';
import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';

export const download = async (url: string) => {
    if (!isTauri()) return;

    const path = await save({
        title: 'Save Packet PDF',
        defaultPath: `${await downloadDir()}/packet.pdf`,
        filters: [{
            name: 'PDF',
            extensions: ['pdf'],
        }]
    });

    if (!path) return;

    const res = await fetch(url);
    await writeFile(path, await (await res.blob()).bytes());
};
