const EXPORTS={
 instagram:{channel:'instagram',format:'reel',aspect:'9:16'},
 youtube:{channel:'youtube',format:'video',aspect:'16:9'},
 linkedin:{channel:'linkedin',format:'video',aspect:'1:1'}
};

export function buildProductionJob({prompt='',outputs=[]}={}){
  const allowed=['video','image','reel','voiceover','caption','hashtags','thumbnail'];
  const selected=[...new Set(outputs.filter(x=>allowed.includes(x)))];
  return {
    brand:'BuildWise AI', prompt:String(prompt||'').trim(), outputs:selected,
    safeBrief:'Create a professional real-estate asset. Do not invent measurements, prices, permits or guarantees.',
    pipeline:['brief','asset-generation','brand-check','metadata','export']
  };
}

export function buildLandVisualizationSpec({landLength=null,landWidth=null,streetWidth=null,aerialImage=null}={}){
  return {
    length:landLength,width:landWidth,streetWidth,aerialImage,
    dimensionLines:true, yellowMeasurementLines:true, blueprintOverlay:true,
    floorAreaVisualization:true,massing:true,modernRender:true
  };
}

export function buildExportProfile(channel='instagram'){
  const key=String(channel).toLowerCase();
  const p=EXPORTS[key]||EXPORTS.instagram;
  return {...p,brand:'BuildWise AI'};
}
