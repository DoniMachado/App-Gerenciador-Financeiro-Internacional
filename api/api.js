const getMoneyTypes = async () =>{

  const uri = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json";

  const response = await fetch(uri);

  const data = await response.json();
  
  return data.value;
}

const getExchangeRate = async (currency, date,type) =>{
  const uri = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${currency}'&@dataCotacao='${date}'&$top=1&$format=json`;
 
  const response = await fetch(uri);

  const data = await response.json();
  
  if(data?.value?.length >= 1){
    const value = type === "despesa"? data.value[0].cotacaoCompra: data.value[0].cotacaoVenda;

    return value;
  }

  return null;
}

export {
  getMoneyTypes,
  getExchangeRate
}