import * as allThemes from '@uiw/codemirror-themes-all';

const themes = {
    abcdef: {
        extension: allThemes.abcdef,
        name: 'abcdef',
    },
    abyss: {
        extension: allThemes.abyss,
        name: 'Abyss',
    },
    androidstudio: {
        extension: allThemes.androidstudio,
        name: 'Android Studio',
    },
    andromeda: {
        extension: allThemes.andromeda,
        name: 'Andromeda',
    },
    atomone: {
        extension: allThemes.atomone,
        name: 'Atomone',
    },
    aura: {
        extension: allThemes.aura,
        name: 'Aura',
    },
    basicDark: {
        extension: allThemes.basicDark,
        name: 'Basic Dark',
    },
    basicLight: {
        extension: allThemes.basicLight,
        name: 'Basic Light',
    },
    bbedit: {
        extension: allThemes.bbedit,
        name: 'Bbedit',
    },
    bespin: {
        extension: allThemes.bespin,
        name: 'Bespin',
    },
    consoleDark: {
        extension: allThemes.consoleDark,
        name: 'Console Dark',
    },
    consoleLight: {
        extension: allThemes.consoleLight,
        name: 'Console Light',
    },
    copilot: {
        extension: allThemes.copilot,
        name: 'Copilot',
    },
    darcula: {
        extension: allThemes.darcula,
        name: 'Darcula',
    },
    dracula: {
        extension: allThemes.dracula,
        name: 'Dracula',
    },
    duotoneDark: {
        extension: allThemes.duotoneDark,
        name: 'Duotone Dark',
    },
    duotoneLight: {
        extension: allThemes.duotoneLight,
        name: 'Duotone Light',
    },
    eclipse: {
        extension: allThemes.eclipse,
        name: 'Eclipse',
    },
    githubDark: {
        extension: allThemes.githubDark,
        name: 'Github Dark',
    },
    githubLight: {
        extension: allThemes.githubLight,
        name: 'Github Light',
    },
    gruvboxDark: {
        extension: allThemes.gruvboxDark,
        name: 'Gruvbox Dark',
    },
    gruvboxLight: {
        extension: allThemes.gruvboxLight,
        name: 'Gruvbox Light',
    },
    kimbie: {
        extension: allThemes.kimbie,
        name: 'Kimbie',
    },
    material: {
        extension: allThemes.material,
        name: 'Material',
    },
    materialDark: {
        extension: allThemes.materialDark,
        name: 'Material Dark',
    },
    materialLight: {
        extension: allThemes.materialLight,
        name: 'Material Light',
    },
    monokai: {
        extension: allThemes.monokai,
        name: 'Monokai',
    },
    monokaiDimmed: {
        extension: allThemes.monokaiDimmed,
        name: 'Monokai Dimmed',
    },
    noctisLilac: {
        extension: allThemes.noctisLilac,
        name: 'Noctis Lilac',
    },
    nord: {
        extension: allThemes.nord,
        name: 'Nord',
    },
    okaidia: {
        extension: allThemes.okaidia,
        name: 'Okaidia',
    },
    quietlight: {
        extension: allThemes.quietlight,
        name: 'Quietlight',
    },
    red: {
        extension: allThemes.red,
        name: 'Red',
    },
    solarizedDark: {
        extension: allThemes.solarizedDark,
        name: 'Solarized Dark',
    },
    solarizedLight: {
        extension: allThemes.solarizedLight,
        name: 'Solarized Light',
    },
    sublime: {
        extension: allThemes.sublime,
        name: 'Sublime',
    },
    tokyoNight: {
        extension: allThemes.tokyoNight,
        name: 'Tokyo Night',
    },
    tokyoNightDay: {
        extension: allThemes.tokyoNightDay,
        name: 'Tokyo Night Day',
    },
    tokyoNightStorm: {
        extension: allThemes.tokyoNightStorm,
        name: 'Tokyo Night Storm',
    },
    tomorrowNightBlue: {
        extension: allThemes.tomorrowNightBlue,
        name: 'Tomorrow Night Blue',
    },
    vscodeDark: {
        extension: allThemes.vscodeDark,
        name: 'VSCode Dark',
    },
    vscodeLight: {
        extension: allThemes.vscodeLight,
        name: 'VSCode Light',
    },
    whiteDark: {
        extension: allThemes.whiteDark,
        name: 'White Dark',
    },
    whiteLight: {
        extension: allThemes.whiteLight,
        name: 'White Light',
    },
    xcodeDark: {
        extension: allThemes.xcodeDark,
        name: 'XCode Dark',
    },
    xcodeLight: {
        extension: allThemes.xcodeLight,
        name: 'XCode Light',
    },
} as const;
export default themes;
export const themeNames = Object.keys(themes);
export type Theme = keyof typeof themes;
