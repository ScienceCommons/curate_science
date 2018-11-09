var C = {
	SITENAME: "Curate Science",
	FILTERS: [
		{
			category: 'area',
			label: "Research area",
			items: [
				{
					id: "social_science",
					label: "Social Sciences"
				},
				{
					id: "medical_life",
					label: "Medical/Life Sciences"
				},
				{
					id: "all",
					label: "All"
				}
			]
		},
		{
			category: 'content_type',
			label: "Content type",
			items: [
				{
					id: 'replications',
					icon: '',
					label: "Replications"
				},
				{
					id: 'collec_replications',
					icon: '',
					label: "Collections of replications",
					disabled: true
				},
				{
					id: 'rean_reproducibility',
					icon: '',
					label: "Renalyses - Reproducibility/Robustness"
				},
				{
					id: 'rean_meta',
					icon: '',
					label: "Renalyses - Meta-analyses (traditional)"
				}
			]
		},
		// Sync with BADGE_FEATURES & transparency data model
		{
			category: 'transparency',
			label: "Transparency",
			items: [
				{
					id: 'prereg',
					icon: '',
					label: "Preregistration"
				},
				{
					id: 'materials',
					icon: '',
					label: "Open Study Materials"
				},
				{
					id: 'data',
					icon: '',
					label: "Open Data"
				},
				{
					id: 'code',
					icon: '',
					label: "Open Code"
				},
				{
					id: 'repstd',
					icon: '',
					label: "Reporting Standards"
				}
			]
		}
	],
	BADGE_FEATURES: [
		{
			id: "prereg",
			label: "Preregistration",
			icon: "prereg"
		},
		{
			id: "materials",
			label: "Public Materials",
			icon: "materials"
		},
		{
			id: "data",
			label: "Public Data",
			icon: "data"
		},
		{
			id: "code",
			label: "Public Code",
			icon: "code"
		},
		{
			id: "repstd",
			label: "Reporting Standards",
			icon: "repstd"
		}
	]
}

export default C;
