export type IconKey = 
    'no_icon'|
    'icon_backpack'|
    'icon_bed'|
    'icon_bier'|
    'icon_bolt'|
    'icon_boots'|
    'icon_bottle'|
    'icon_camera'|
    'icon_clock'|
    'icon_clothes'|
    'icon_coffee'|
    'icon_fishing'|
    'icon_flashlight'|
    'icon_food'|
    // 'icon_goggles'|
    'icon_health'|
    'icon_heart'|
    'icon_light'|
    'icon_map'|
    'icon_moon'|
    'icon_paw'|
    'icon_recycle'|
    'icon_shower'|
    'icon_star'|
    'icon_sun'|
    'icon_tent'|
    'icon_toiletpaper'|
    'icon_toothbrush'|
    'icon_trash'|
    'icon_walk'|
    'icon_water'|
    'icon_wind'|
    'icon_zzz'

export const ICON_COLORS: Readonly<Record<IconKey, string>> = {
    no_icon : '#cbd0d0',
    icon_backpack : '#6b9430',
    icon_walk : '#288711',
    icon_boots : '#965509',
    icon_bed : '#1a57a6',
    icon_tent : '#2b638c',
    icon_zzz : '#053a60',
    icon_moon : '#023b56',
    icon_bier : '#f9c92f',
    icon_bolt : '#e2ea0c',
    icon_bottle : '#03eaea',
    icon_camera : '#e9ec6c',
    icon_clock : '#ea70de',
    icon_clothes : '#903386',
    icon_coffee : '#6b4a2b',
    icon_fishing : '#0ba0ad',
    icon_flashlight : '#f3c005',
    icon_food : '#ef8e6c',
    icon_health : '#c50e0e',
    icon_heart : '#870101',
    icon_light : '#f3c005',
    icon_map : '#b18b50',
    icon_paw : '#c5882b',
    icon_recycle : '#1bd424',
    icon_shower : '#2fef9e',
    icon_star : '#ffed00',
    icon_sun : '#f38f05',
    icon_toiletpaper : '#e5e8e7',
    icon_toothbrush : '#01bb6d',
    icon_trash : '#3f3f3f',
    icon_water : '#38b8f9',
    icon_wind : '#cfe8f5',
} as const;