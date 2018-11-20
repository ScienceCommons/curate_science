var C = {
	SITENAME: "Curate Science",
	ARTICLE_TYPES: [
        {
			id: "ORIGINAL",
			label: "Original research",
			relevant_sections: ['studies']
		},
	    {
			id: "REPLICATION",
			label: "Replication",
			relevant_sections: ['replication', 'studies']
		},
        {
			id: "REPRODUCIBILITY",
			label: "Reanalysis - Reproducibility/Robustness",
			relevant_sections: ['reanalysis']
		},
        {
			id: "META_ANALYSIS",
			label: "Renalysis - Meta-analysis",
			relevant_sections: ['reanalysis']
		},
        {
			id: "META_RESEARCH",
			label: "Renalysis - Meta-research",
			relevant_sections: ['reanalysis']
		},
        {
			id: "COMMENTARY",
			label: "Commentary",
			relevant_sections: ['commentary']
		}
	],
	RESEARCH_AREAS: [
		{
			id: "SOCIAL_SCIENCE",
			label: "Social Sciences"
		},
		{
			id: "MEDICAL_LIFE_SCIENCE",
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
					id: 'REPLICATION',
					icon: '',
					label: "Replications"
				},
				{
					id: 'COLLECTION',
					icon: '',
					label: "Collections of replications",
					disabled: true
				},
				{
					id: 'REPRODUCIBILITY',
					icon: '',
					label: "Renalyses - Reproducibility/Robustness"
				},
				{
					id: 'META_ANALYSIS',
					icon: '',
					label: "Renalyses - Meta-analyses (traditional)"
				},
				{
					id: 'ORIGINAL',
					icon: '',
					label: "Original Research"
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
			icon: "prereg",
			article_types: ['ORIGINAL', 'REPLICATION', 'META_ANALYSIS', 'META_RESEARCH', 'REPRODUCIBILITY']
		},
		{
			id: "materials",
			label: "Public Materials",
			icon: "materials",
			article_types: ['ORIGINAL', 'REPLICATION']
		},
		{
			id: "data",
			label: "Public Data",
			icon: "data",
			article_types: ['ORIGINAL', 'REPLICATION', 'META_ANALYSIS', 'META_RESEARCH', 'REPRODUCIBILITY']
		},
		{
			id: "code",
			label: "Public Code",
			icon: "code",
			article_types: ['ORIGINAL', 'REPLICATION', 'META_ANALYSIS', 'META_RESEARCH', 'REPRODUCIBILITY']
		},
		{
			id: "repstd",
			label: "Reporting Standards",
			icon: "repstd",
			article_types: ['ORIGINAL', 'REPLICATION', 'META_ANALYSIS', 'META_RESEARCH']
		}
	]
}

export default C;
