import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeApiError,
	IDataObject,
	IHttpRequestMethods,
} from 'n8n-workflow';

export class CompanyEnrich implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Company Enrich',
		name: 'companyEnrich',
		icon: "file:../../icons/companyenrich.png",
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Enrich company data and find lookalikes via CompanyEnrich API',
		defaults: {
			name: 'Company Enrich',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'companyEnrichApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Company',
						value: 'company',
					},
				],
				default: 'company',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'company',
						],
					},
				},
				options: [
					{
						name: 'Count',
						value: 'count',
						description: 'Count companies matching criteria',
						action: 'Count companies matching criteria',
					},
					{
						name: 'Enrich',
						value: 'enrich',
						description: 'Enrich company data',
						action: 'Enrich company data',
					},
					{
						name: 'Find Similar',
						value: 'findSimilar',
						description: 'Find similar companies',
						action: 'Find similar companies',
					},
					{
						name: 'Get Usage',
						value: 'getUsage',
						description: 'Get account usage',
						action: 'Get account usage',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search companies',
						action: 'Search companies',
					},
				],
				default: 'enrich',
			},
			// Enrich Operation Input
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'company',
						],
						operation: [
							'enrich',
						],
					},
				},
				description: 'The domain of the company to enrich',
			},
			// Find Similar Operation Input (Top Level)
			{
				displayName: 'Domains',
				name: 'domains',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'company',
						],
						operation: [
							'findSimilar',
						],
					},
				},
				description: 'One or more domains to find lookalikes for (comma-separated)',
			},
			// Filters Collection for Find Similar, Search, Count
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'company',
						],
						operation: [
							'findSimilar',
							'search',
							'count',
						],
					},
				},
				options: [
					{
						displayName: 'Categories',
						name: 'categories',
						type: 'string',
						default: '',
						description: 'Comma-separated list of categories',
					},
					{
						displayName: 'Category Operator',
						name: 'categoryOperator',
						type: 'options',
						options: [
							{ name: 'And', value: 'and' },
							{ name: 'Or', value: 'or' },
						],
						default: 'or',
					},
					{
						displayName: 'Cities',
						name: 'cities',
						type: 'string',
						default: '',
						description: 'Comma-separated list of city IDs',
					},
					{
						displayName: 'Countries',
						name: 'countries',
						type: 'string',
						default: '',
						description: 'Comma-separated list of 2-letter country codes',
					},
					{
						displayName: 'Employees',
						name: 'employees',
						type: 'string',
						default: '',
						description: 'Comma-separated list of employee ranges (e.g. "1-10, 11-50")',
					},
					{
						displayName: 'Founded Year',
						name: 'foundedYear',
						type: 'fixedCollection',
						placeholder: 'Add Year Range',
						default: {},
						options: [
							{
								displayName: 'Range',
								name: 'values',
								values: [
									{
										displayName: 'Min',
										name: 'min',
										type: 'number',
										default: 1900,
									},
									{
										displayName: 'Max',
										name: 'max',
										type: 'number',
										default: 2025,
									},
								],
							},
						],
					},
					{
						displayName: 'Funding Amount',
						name: 'fundingAmount',
						type: 'fixedCollection',
						placeholder: 'Add Funding Range',
						default: {},
						options: [
							{
								displayName: 'Range',
								name: 'values',
								values: [
									{
										displayName: 'Min',
										name: 'min',
										type: 'number',
										default: 0,
									},
									{
										displayName: 'Max',
										name: 'max',
										type: 'number',
										default: 1000000,
									},
								],
							},
						],
					},
					{
						displayName: 'Funding Rounds',
						name: 'fundingRounds',
						type: 'string',
						default: '',
						description: 'Comma-separated list of funding rounds',
					},
					{
						displayName: 'Funding Year',
						name: 'fundingYear',
						type: 'fixedCollection',
						placeholder: 'Add Funding Year Range',
						default: {},
						options: [
							{
								displayName: 'Range',
								name: 'values',
								values: [
									{
										displayName: 'Min',
										name: 'min',
										type: 'number',
										default: 2000,
									},
									{
										displayName: 'Max',
										name: 'max',
										type: 'number',
										default: 2025,
									},
								],
							},
						],
					},
					{
						displayName: 'Keywords',
						name: 'keywords',
						type: 'string',
						default: '',
						description: 'Comma-separated list of keywords',
					},
					{
						displayName: 'Keywords Operator',
						name: 'keywordsOperator',
						type: 'options',
						options: [
							{ name: 'And', value: 'and' },
							{ name: 'Or', value: 'or' },
						],
						default: 'or',
					},
					{
						displayName: 'NAICS Codes',
						name: 'naicsCode',
						type: 'string',
						default: '',
						description: 'Comma-separated list of NAICS codes',
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Page number',
					},
					{
						displayName: 'Page Size',
						name: 'pageSize',
						type: 'number',
						default: 10,
						description: 'Number of results per page',
					},
					{
						displayName: 'Query',
						name: 'query',
						type: 'string',
						default: '',
						description: 'Search query',
						displayOptions: {
							show: {
								'/operation': [
									'search',
									'count',
								],
							},
						},
					},
					{
						displayName: 'Regions',
						name: 'regions',
						type: 'string',
						default: '',
						description: 'Comma-separated list of regions',
					},
					{
						displayName: 'Require',
						name: 'require',
						type: 'string',
						default: '',
						description: 'Comma-separated list of features that must exist',
					},
					{
						displayName: 'Revenue',
						name: 'revenue',
						type: 'string',
						default: '',
						description: 'Comma-separated list of revenue ranges',
					},
					{
						displayName: 'Similarity Weight',
						name: 'similarityWeight',
						type: 'number',
						default: 0.5,
						description: 'Weight for similarity matching (-1 to 1)',
					},
					{
						displayName: 'States',
						name: 'states',
						type: 'string',
						default: '',
						description: 'Comma-separated list of state IDs',
					},
					{
						displayName: 'Technologies',
						name: 'technologies',
						type: 'string',
						default: '',
						description: 'Comma-separated list of technologies',
					},
					{
						displayName: 'Technologies Operator',
						name: 'technologiesOperator',
						type: 'options',
						options: [
							{ name: 'And', value: 'and' },
							{ name: 'Or', value: 'or' },
						],
						default: 'or',
					},
					{
						displayName: 'Types',
						name: 'types',
						type: 'string',
						default: '',
						description: 'Comma-separated list of company types',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let responseData;
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'company') {
					if (operation === 'enrich') {
						const domain = this.getNodeParameter('domain', i) as string;
						
						const options = {
							method: 'GET' as IHttpRequestMethods,
							url: 'https://api.companyenrich.com/companies/enrich',
							qs: {
								domain,
							},
							json: true,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'companyEnrichApi', options);
					} else if (operation === 'getUsage') {
						const options = {
							method: 'GET' as IHttpRequestMethods,
							url: 'https://api.companyenrich.com/me',
							json: true,
						};
						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'companyEnrichApi', options);
					} else if (['findSimilar', 'search', 'count'].includes(operation)) {
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const body: IDataObject = {};

						// Helper to split comma-separated strings to array
						const splitToArray = (val: string) => val.split(',').map(s => s.trim()).filter(s => s);

						// Core Params
						if (operation === 'findSimilar') {
							const domains = this.getNodeParameter('domains', i) as string;
							body.domains = splitToArray(domains);
						}
						
						if (filters.query) body.query = filters.query;
						if (filters.similarityWeight !== undefined) body.similarityWeight = filters.similarityWeight;
						if (filters.page) body.page = filters.page;
						if (filters.pageSize) body.pageSize = filters.pageSize;

						// Arrays
						if (filters.keywords) body.keywords = splitToArray(filters.keywords as string);
						if (filters.technologies) body.technologies = splitToArray(filters.technologies as string);
						if (filters.categories) body.categories = splitToArray(filters.categories as string);
						if (filters.types) body.type = splitToArray(filters.types as string); // Mapped to 'type'
						if (filters.fundingRounds) body.fundingRounds = splitToArray(filters.fundingRounds as string);
						if (filters.regions) body.regions = splitToArray(filters.regions as string);
						if (filters.countries) body.countries = splitToArray(filters.countries as string);
						if (filters.states) body.states = splitToArray(filters.states as string);
						if (filters.cities) body.cities = splitToArray(filters.cities as string);
						if (filters.naicsCode) body.naicsCode = splitToArray(filters.naicsCode as string);
						if (filters.employees) body.employees = splitToArray(filters.employees as string);
						if (filters.revenue) body.revenue = splitToArray(filters.revenue as string);
						if (filters.require) body.require = splitToArray(filters.require as string);

						// Operators
						if (filters.keywordsOperator) body.keywordsOperator = filters.keywordsOperator;
						if (filters.technologiesOperator) body.technologiesOperator = filters.technologiesOperator;
						if (filters.categoryOperator) body.categoryOperator = filters.categoryOperator;

						// Ranges
						if (filters.foundedYear) {
							const range = (filters.foundedYear as IDataObject).values as IDataObject;
							if (range) body.foundedYear = range;
						}
						if (filters.fundingAmount) {
							const range = (filters.fundingAmount as IDataObject).values as IDataObject;
							if (range) body.fundingAmount = range;
						}
						if (filters.fundingYear) {
							const range = (filters.fundingYear as IDataObject).values as IDataObject;
							if (range) body.fundingYear = range;
						}

						let endpoint = '';
						if (operation === 'findSimilar') endpoint = '/companies/similar';
						else if (operation === 'search') endpoint = '/companies/search/preview';
						else if (operation === 'count') endpoint = '/companies/search/count';

						const options = {
							method: 'POST' as IHttpRequestMethods,
							url: `https://api.companyenrich.com${endpoint}`,
							body,
							json: true,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'companyEnrichApi', options);
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);

			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw new NodeApiError(this.getNode(), error);
			}
		}

		return [returnData];
	}
}
