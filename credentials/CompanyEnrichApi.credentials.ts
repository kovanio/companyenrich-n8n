import {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CompanyEnrichApi implements ICredentialType {
	name = 'companyEnrichApi';
	displayName = 'Company Enrich API';
	documentationUrl = 'https://docs.companyenrich.com/reference';
	icon = 'file:../icons/companyenrich.png' as Icon;
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiKey}}',
			},
		},
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.companyenrich.com',
			url: '/me',
		},
	};
}
