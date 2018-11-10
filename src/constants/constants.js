var C = {
	SITENAME: "Curate Science",
	ARTICLE_TYPES: [
        {
			id: "ORIGINAL",
			label: "Original research"
		},
	    {
			id: "REPLICATION",
			label: "Replication(s)?"
		},
        {
			id: "REPRODUCIBILITY",
			label: "Reanalysis - Reproducibility/Robustness"
		},
        {
			id: "META_ANALYSIS",
			label: "Renalysis - Meta-analysis"
		},
        {
			id: "META_RESEARCH",
			label: "Renalysis - Meta-research"
		},
        {
			id: "COMMENTARY",
			label: "Commentary"
		}
	],
	RESEARCH_AREAS: [
		{
			id: "social_science",
			label: "Social Sciences"
		},
		{
			id: "medical_life",
			label: "Medical/Life Sciences"
		}
	],
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
		// Sync with TRANSPARENCY_BADGES & transparency data model
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
	TRANSPARENCY_BADGES: [
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
