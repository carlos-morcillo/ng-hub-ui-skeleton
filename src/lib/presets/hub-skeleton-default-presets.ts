import { HubSkeletonPreset } from '../models/hub-skeleton.types';

/**
 * Bundled preset catalogue used by the skeleton library.
 */
export const HUB_SKELETON_DEFAULT_PRESETS: readonly HubSkeletonPreset[] = [
	{
		name: 'card',
		description: 'Generic content card with media, title and body lines.',
		template:
			'stack(gap:16)>block(height:{{mediaHeight}},radius:{{radius}})+line(height:{{titleHeight}},width:{{titleWidth}})+stack(gap:{{bodyGap}})>line(height:{{lineHeight}},width:100%)*{{rows}}+line(height:{{lineHeight}},width:{{lastLineWidth}})',
		defaults: {
			mediaHeight: 180,
			radius: 18,
			titleHeight: 18,
			titleWidth: '56%',
			bodyGap: 10,
			lineHeight: 12,
			rows: 2,
			lastLineWidth: '76%'
		},
		variants: {
			compact: {
				defaults: {
					mediaHeight: 120,
					radius: 14,
					titleHeight: 16,
					bodyGap: 8,
					lineHeight: 10,
					rows: 1,
					lastLineWidth: '68%'
				}
			}
		}
	},
	{
		name: 'list-item',
		description: 'Avatar row with title and subtitle lines.',
		template:
			'stack(direction:row,gap:12,align:center)>circle(size:{{avatarSize}})+stack(gap:{{gap}},grow:1)>line(height:{{titleHeight}},width:{{titleWidth}})+line(height:{{lineHeight}},width:{{lineWidth}})',
		defaults: {
			avatarSize: 44,
			gap: 8,
			titleHeight: 14,
			titleWidth: '42%',
			lineHeight: 10,
			lineWidth: '68%'
		},
		variants: {
			compact: {
				defaults: {
					avatarSize: 36,
					gap: 6,
					titleHeight: 12,
					lineHeight: 8
				}
			}
		}
	},
	{
		name: 'table-row',
		description: 'Grid row that adapts to the configured column count.',
		template: 'grid(columns:{{columns}},gap:12|md=16)>line(height:{{lineHeight}},width:{{cellWidth}})*{{columns}}',
		defaults: {
			columns: 4,
			lineHeight: 12,
			cellWidth: '88%'
		}
	},
	{
		name: 'detail-view',
		description: 'Two-column detail layout with hero block and metadata rows.',
		template:
			'grid(columns:1|lg=2,gap:20)>block(height:220|lg=280,radius:20)+stack(gap:14)>line(height:20,width:48%)+line(height:12,width:78%)+line(height:12,width:92%)+line(height:12,width:70%)+grid(columns:2,gap:12)>block(height:64)*4'
	},
	{
		name: 'form-section',
		description: 'Grouped form controls with header and responsive fields.',
		template:
			'stack(gap:18)>line(height:18,width:32%)+grid(columns:1|md=2,gap:14)>stack(gap:8)>line(height:10,width:28%)+block(height:44,radius:12)*{{fields}}',
		defaults: {
			fields: 4
		}
	},
	{
		name: 'dashboard-widget',
		description: 'Panel header with metric rows and footer actions.',
		template:
			'stack(gap:16)>stack(direction:row,gap:12,justify:space-between,align:center)>line(height:16,width:36%)+circle(size:20)+block(height:132,radius:18)+grid(columns:2,gap:12)>line(height:12,width:72%)*4'
	},
	{
		name: 'stat-card',
		description: 'Metric summary card with title, large value and trend.',
		template:
			'stack(gap:14)>line(height:12,width:34%)+line(height:34,width:44%)+line(height:10,width:28%)+block(height:44,radius:14)'
	},
	{
		name: 'chart-panel',
		description: 'Chart block with legend rows.',
		template:
			'stack(gap:16)>stack(direction:row,gap:12,justify:space-between,align:center)>line(height:16,width:40%)+line(height:10,width:18%)+block(height:220,radius:18)+grid(columns:2,gap:10)>stack(direction:row,gap:8,align:center)>circle(size:10)+line(height:10,width:60%)*4'
	},
	{
		name: 'profile-summary',
		description: 'Profile card with avatar, identity and summary metrics.',
		template:
			'stack(gap:16,align:center)>circle(size:88)+line(height:18,width:46%)+line(height:12,width:62%)+grid(columns:3,gap:12)>block(height:56,radius:14)*3'
	},
	{
		name: 'master-detail',
		description: 'List panel and detail panel skeleton pair.',
		template:
			'grid(columns:1|lg=3,gap:20)>stack(gap:12)>list-item*4+stack(gap:16)>block(height:220,radius:18)+line(height:18,width:42%)+line(height:12,width:92%)*3+line(height:12,width:70%)'
	},
	{
		name: 'kanban-card',
		description: 'Compact board card with title, metadata and footer chips.',
		template:
			'stack(gap:12)>line(height:14,width:58%)+line(height:10,width:80%)+stack(direction:row,gap:8)>block(height:24,width:76,radius:999)+block(height:24,width:92,radius:999)'
	},
	{
		name: 'feed-item',
		description: 'Activity feed row with avatar and content snippets.',
		template:
			'stack(direction:row,gap:12,align:flex-start)>circle(size:40)+stack(gap:8,grow:1)>line(height:12,width:34%)+line(height:12,width:94%)+line(height:12,width:74%)'
	},
	{
		name: 'search-result',
		description: 'Search result card with title, metadata and excerpt.',
		template:
			'stack(gap:12)>line(height:18,width:56%)+stack(direction:row,gap:10)>line(height:10,width:20%)+line(height:10,width:18%)+line(height:10,width:24%)+line(height:12,width:92%)*2+line(height:12,width:76%)'
	},
	{
		name: 'table-toolbar',
		description: 'Toolbar with title, filters and actions.',
		template:
			'grid(columns:1|md=2,gap:16,align:center)>line(height:18,width:38%)+stack(direction:row,gap:10,justify:flex-end)>block(height:38,width:180,radius:12)+block(height:38,width:110,radius:12)+block(height:38,width:92,radius:12)'
	},
	{
		name: 'filter-bar',
		description: 'Row of filter controls with mobile stacking.',
		template:
			'grid(columns:1|md=4,gap:12)>block(height:40,radius:12)*{{filters}}',
		defaults: {
			filters: 4
		}
	},
	{
		name: 'empty-state-skeleton',
		description: 'Illustrative empty-state placeholder with title and actions.',
		template:
			'stack(gap:18,align:center)>block(height:160,width:240,radius:28)+line(height:18,width:36%)+line(height:12,width:64%)+line(height:12,width:52%)+stack(direction:row,gap:12)>block(height:40,width:120,radius:999)+block(height:40,width:84,radius:999)'
	}
] as const;
