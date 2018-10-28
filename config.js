// TODO: environmets in application
var environments={};

// TODO: Dev ENV
environments.development={
  'httpPort':8080,
  'httpsPort':8085,
  'envName':'development'
}
// TODO: Testing or staging ENV
environments.staging={
  'port':9090,
  'envName':'staging'
}

// TODO: production ENV
environments.production={
  'port':8000,
  'envName':'production'
}

// TODO: Match ENV
var currentEnv=typeof(process.env.NODE_ENV)=='string'?process.env.NODE_ENV.toLowerCase():'';

// TODO: exprot Current ENV
var currentEnvExport=typeof(environments[currentEnv])=='object'?environments[currentEnv]:environments.development;

module.exports=currentEnvExport;
