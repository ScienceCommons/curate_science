var C = {
	SITENAME: "Curate Science",
	ARTICLE_TYPES: [
        {
			id: "ORIGINAL",
			label: "Original",
			relevant_sections: ['studies'],
			color: '#000000'
		},
	    {
			id: "REPLICATION",
			label: "Replication",
			relevant_sections: ['replication', 'studies'],
			color: '#996633'
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
			relevant_sections: ['commentary'],
			color: '#5F5F5F',
			transparencies_bonus: true
		},
        {
			id: "CONCEPTUAL",
			label: "Conceptual",
			color: '#008080',
			relevant_sections: ['studies'],
			transparencies_bonus: true
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
	METHOD_SIMILARITY: [
		{
			value: 'SIMILAR',
			label: "Close"
		},
		{
			value: 'VERY_SIMILAR',
			label: "Very Close"
		},
		{
			value: 'EXACT',
			label: "Exact"
		}
	],
	FILTERS: [
		{
			category: 'area',
			label: "Research area",
			type: 'radio',
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
					label: "Preregistration"
				},
				{
					id: 'materials',
					label: "Open Study Materials"
				},
				{
					id: 'data',
					label: "Open Data"
				},
				{
					id: 'code',
					label: "Open Code"
				},
				{
					id: 'repstd',
					label: "Reporting Standards"
				}
			]
		}
	],
	TRANSPARENCY_BADGES: [
		{
			id: "PREREG",
			label: "Preregistration",
			icon: "prereg",
			article_types: ['ORIGINAL', 'REPLICATION', 'META_ANALYSIS', 'META_RESEARCH', 'REPRODUCIBILITY'],
			color: '#C60018',
			url_prop: 'prereg_protocol_url'
		},
		{
			id: "MATERIALS",
			label: "Public Materials",
			icon: "materials",
			article_types: ['ORIGINAL', 'REPLICATION'],
			color: '#F5A623',
			url_prop: 'public_study_materials_url'
		},
		{
			id: "DATA",
			label: "Public Data",
			icon: "data",
			article_types: ['ORIGINAL', 'REPLICATION', 'META_ANALYSIS', 'META_RESEARCH', 'REPRODUCIBILITY'],
			color: '#2D96E8',
			url_prop: 'public_data_url'
		},
		{
			id: "CODE",
			label: "Public Code",
			icon: "code",
			article_types: ['ORIGINAL', 'REPLICATION', 'META_ANALYSIS', 'META_RESEARCH', 'REPRODUCIBILITY'],
			color: '#50E3C2',
			url_prop: 'public_code_url'
		},
		{
			id: "REPSTD",
			label: "Reporting Standards",
			icon: "repstd",
			article_types: ['ORIGINAL', 'REPLICATION', 'META_ANALYSIS', 'META_RESEARCH'],
			singular: true,
			color: '#7ED321'
		}
	],
	REPORTING_STANDARDS_TYPES: [
		{
			value: '',
			label: "None"
		},
		{
			value: 'BASIC_4_AT_SUBMISSION',
			label: "Basic-4 (at submission; PSCI, 2014)",
			html_detail: ""
		},
		{
			value: 'BASIC_4_RETROACTIVE',
			label: "Basic-4 (retroactive; 2012)",
			html_detail: "<ol style='margin-top:5px;margin-bottom:5px;padding-left:10px;'><li><strong>Excluded data (subjects/observations):</strong> Full details reported in article.</li>  <li><strong>Experimental conditions:</strong> Full details reported in article.</li><li><strong>Outcome measures:</strong> Full details reported in article.</li>	   <li><strong>Sample size determination:</strong> Full details reported in article.</li></ol><input type='text' name='disclosureDate' placeholder='Retroactive disclosure date (MM/DD/YYYY)' style='color:#999999;' size='35'><br><br><a href='https://psychdisclosure.org/' target='_blank'>Details of the 'Basic 4 (retroactive) reporting standard (2012)'</a>"
		},
		{
			value: 'CONSORT_SPI',
			label: "CONSORT-SPI (2018)",
			html_detail: "<br/><a href='https://trialsjournal.biomedcentral.com/track/pdf/10.1186/s13063-018-2733-1' target='_blank'>Randomized trials of social and psychological interventions (CONSORT-SPI 2018; 26 items)</a> "
		},
		{
			value: 'CONSORT',
			label: "CONSORT (2010)",
			html_detail: "<br/><a href='http://www.consort-statement.org/media/default/downloads/consort%202010%20checklist.pdf' target='_blank'>Parallel-group RCTs reporting checklist (CONSORT 2010; 25 items)</a>"
		},
		{
			value: 'JARS',
			label: "JARS (2018)",
			html_detail: "<br/><a href='http://www.apa.org/pubs/journals/releases/amp-amp0000191.pdf' target='_blank'>Journal article reporting standards for articles reporting new data (APA's JARS; see Table 1)</a>"
		},
		{
			value: 'STROBE',
			label: "STROBE (2007)",
			html_detail: "<br/><a href='https://www.strobe-statement.org/fileadmin/Strobe/uploads/checklists/STROBE_checklist_v4_combined.pdf' target='_blank'>Observational/correlational studies reporting checklist (STROBE 2007; 22 items)</a>"
		},
		{
			value: 'ARRIVE',
			label: "ARRIVE (2010)",
			html_detail: "<br/><a href='https://www.nc3rs.org.uk/sites/default/files/documents/Guidelines/NC3Rs%20ARRIVE%20Guidelines%20Checklist%20%28fillable%29.pdf' target='_blank'>Animal research reporting checklist (ARRIVE 2010; 20 items)</a>"
		},
		{
			value: 'NATURE_NEUROSCIENCE',
			label: "Nature Neuroscience (2015)",
			html_detail: "<br/><a href='https://www.nature.com/authors/policies/reporting.pdf' target='_blank'>Life Science research checklist (Nature Neuroscience, 2015)</a>"
		},
		{
			value: 'MARS',
			label: "MARS (2018)",
			html_detail: "<br/><a href='http://www.apa.org/pubs/journals/releases/amp-amp0000191.pdf' target='_blank'>Meta-Analysis Reporting Standards (APA's MARS; see Table 9)</a>"
		},
		{
			value: 'PRISMA',
			label: "PRISMA (2009)",
			html_detail: "<br/><a href='http://prisma-statement.org/documents/PRISMA%202009%20checklist.pdf' target='_blank'>Systematic reviews/meta-analyses reporting checklist (PRISMA 2009; 27 items)</a>"
		},
		{
			value: 'PRISMA_P',
			label: "PRISMA-P (2015)",
			html_detail: "<br/><a href='http://prisma-statement.org/documents/PRISMA-P-checklist.pdf' target='_blank'>Systematic reviews/meta-analyses reporting checklist (<b>Updated</b> PRISMA-P 2015; 17 items)</a>"
		}
    ],
    // Sync with fields in Article()
    PREREG_PROTOCOL_TYPES: [
    	{ value: "PREREG_STUDY_DESIGN_ANALYSIS", label: "Preregistered study design + analysis"},
    	{ value: "PREREG_STUDY_DESIGN", label: "Preregistered study design"},
    	{ value: "REGISTERED_REPORT", label: "Registered report"}
	],
    AUTHOR_LINKS: [
	    {
	        id: 'gscholar',
	        type: 'url',
	        label: "Google Scholar profile URL",
	        icon: "/sitestatic/icons/gscholar.svg"
	    },
	    {
	        id: 'orcid',
	        type: 'url',
	        label: "ORC ID profile URL",
	        icon: "/sitestatic/icons/orcid.svg"
	    },
	    {
	        id: 'twitter',
	        type: 'url',
	        label: "Twitter profile URL",
	        icon: "/sitestatic/icons/twitter.svg"
	    },
	    {
	        id: 'researchgate',
	        type: 'url',
	        label: "ResearchGate profile URL",
	        icon: "/sitestatic/icons/researchgate.svg"
	    },
	    {
	        id: 'academia',
	        type: 'url',
	        label: "Academia.edu profile URL",
	        icon: "/sitestatic/icons/academia.svg"
	    },
	    {
	        id: 'blog',
	        type: 'url',
	        label: "Blog URL",
	        icon: "/sitestatic/icons/blog.svg"
	    },
	    {
	        id: 'email',
	        type: 'email',
	        label: "Email address",
	        icon: "/sitestatic/icons/email.svg"
	    },
	    {
	        id: 'website',
	        type: 'url',
	        label: "Website URL",
	        icon: "/sitestatic/icons/website.svg"
	    },
	    {
	        id: 'osf',
	        type: 'url',
	        label: "OSF profile URL",
	        icon: "/sitestatic/icons/osf.svg"
	    }
    ]
}

export default C;
