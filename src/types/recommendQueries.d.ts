type RecommendItem = {
  name: string;
  id: number;
};

type ItemsInLocalStorage = {
  [index: string]: RecommendItem[];
};

/*
{
    	 아 : [{"name":"아구창","id":7768},{"name":"아동 학대","id":6588}],
    	 안 : [[{"name":"안장코","id":5918},{"name":"안구암","id":6672}],
    	 안구 : [{"name":"안구암","id":6672},{"name":"안구건조","id":6650},

  }

*/
