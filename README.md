# 현재 과제 진행 상황
## **Assignment 1**

- 질환명 검색시 API 호출 통해서 검색어 추천 기능 구현
- 검색어가 없을 시 “검색어 없음” 표출
- API를 호출할 때 마다 콘솔창에서 API 호출 횟수 확인이 가능하도록 설정

**풀이 과정**

1. services 폴더에 검색한 입력값을 받아서 api 호출을 하여 데이터를 받아오는 함수를 구현하였습니다. 
2. 해당 검색어에 맞는 결과가 없을 땐 빈배열을 받아오는데,  응답 데이터의 판단 유무를 좀더 가시성 있게 하기 위해서 빈배열일 때는 `null`을 리턴해주도록 구현하였습니다.
    
    ```jsx
    import axios from 'axios';
    
    export const getItemsFromAPI = async (value: string) => {
      try {
        console.info('calling api');
        const itemsRes = await axios({
          method: 'get',
          url: `api/v1/search-conditions/?name=${value}`,
        });
    
        return itemsRes.data.length > 0 ? itemsRes.data : null;
      } catch (error) {
        console.log(error);
        return null;
      }
    };
    ```
    
3. api를 통해 받아온 데이터가 `null` 이 아니면, **추천검색어배열**을  상태(`setRecommentItems`)로 업데이트 합니다. 
    
    ```jsx
    const apiRes: RecommendItem[] | null = await getItemsFromAPI(value);
    
          if (apiRes) {
            setRecommentItems(apiRes);
            ~~
          }
    ```
    
4. api를 통해 받아온 데이터는 localStorage에 없는 데이터 이므로, localStorage에 받아온 데이터를 저장합니다. 해당 함수에 필요한 인자는 `검색어입력값`, `받아온 데이터`, localStorage의 추천검색어들을 모은 값의 `key` 입니다.
    
    ```jsx
    const apiRes: RecommendItem[] | null = await getItemsFromAPI(value);
    
          if (apiRes) {
            ~~
            saveItemsOnLocalStorage(value, apiRes, RecommendItemsStorageKey);
          }
    ```
    
5. localStorage에 `recommendQueries` 라는 `key` 로 받아온 데이터를 저장하게 되는데, 경우의 수는 2가지 입니다. 아래의 두가지를 분기하여 데이터를 저장합니다.
    1. localStorage에 추천 검색어 데이터 자체가 아예 없는 경우 (저장된게 아무것도 없는 경우, 초기)
    2. 추천 검색어 데이터는 있는데 내가 검색한 데이터가 없는 경우
    
    ```jsx
    export const saveItemsOnLocalStorage = (
      query: string,
      items: RecommendItem[],
      storageKey: string,
    ) => {
      const parsedItems = parseItemsFromLocalstorage(storageKey);
      if (!parsedItems) { // 추천 검색어 데이터 자체가 아예 없는 경우
        localStorage.setItem(storageKey, JSON.stringify({ [query]: items }));
      } else { // 추천 검색어 데이터는 있는데 내가 검색한게 없는 경우
        const nextItems = parsedItems && Object.assign(parsedItems, { [query]: items });
        localStorage.setItem(storageKey, JSON.stringify(nextItems));
      }
    };
    ```
    

## **Assignment 2**

- API 호출별로 로컬 캐싱 구현

### 풀이 과정

1. 검색어가 변경되면 `useEffect`를 통해서 해당 검색어와 localStorage 키명을 함수에 넣어 데이터를 불러오는 함수(`getRecommendItems`)를 호출 합니다.
    
    ```jsx
    useEffect(() => {
        const getRecommendItems = async (value: string, key: string) => {
    				~~
        };
    
        if (!query) return;
        getRecommendItems(query, RecommendItemsStorageKey);
      }, [query]);
    ```
    
2. 데이터를 불러오는 순서는 아래와 같습니다.
    1. localStorage에 추천 검색어에 관련한 데이터가 있는지 확인 한다.
        1. 추천 검색어 관련한 데이터가 없으면 API를 호출한다.
        2. 추천 검색어 관련한 데이터가 있으면 localStorage에서 입력한 검색어 데이터가 있는지 확인한다.
            1. 검색어에 맞는 데이터가 있으면 해당 데이터를 가져와서 상태를 업데이트 한다.
            2. 검색어에 맞는 데이터가 없으면 API를 호출한다.
    
    ```jsx
     const getRecommendItems = async (value: string, key: string) => {
          const parsedItems = parseItemsFromLocalstorage(key);
          if (parsedItems) {
            const localStorageRes: RecommendItem[] | null = getItemsFromLocalstorage(
              value,
              parsedItems,
            );
            if (localStorageRes) {
              return setRecommentItems(localStorageRes);
            }
          }
    
          const apiRes: RecommendItem[] | null = await getItemsFromAPI(value);
    
          if (apiRes) {
            setRecommentItems(apiRes);
            saveItemsOnLocalStorage(value, apiRes, RecommendItemsStorageKey);
          }
        };
    ```
    

## **Assignment 3**

- 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행

### 풀이 과정

1. debounce라는 개념을 도입해서 일정 시간이내에 입력한 글자를 하나로모아 전달하는 훅을 구현한다. (검색시 나오는 블로그 코드와 거의 99프로 동일합니다)
    
    ```jsx
    import { useEffect, useState } from 'react';
    
    function useDebounce(value: string, delay = 500) {
      const [debounceVal, setDebounceVal] = useState(value);
    
      useEffect(() => {
        const handler = setTimeout(() => {
          setDebounceVal(value);
        }, delay);
        return () => {
          clearTimeout(handler);
        };
      }, [value, delay]);
    
      return debounceVal;
    }
    
    export default useDebounce;
    ```
    
2. `onChangeHandler` 로 상태변경된 `query`에 가 `useDebounce` 훅을 통해서 압축?된 쿼리로 변경됩니다.
    
    ```jsx
    export default function SearchBar() {
    ~~
      const [query, setQuery] = useState('');
      const debouncedQuery = useDebounce(query);
    
      const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
      };
    
    useEffect(~~);
    ```
    
3. 변경된 `debouncedQuery` 에 따라서 `useEffect`가 호출되며, 압축된 검색어가 데이터를 불러오는 함수의 인자로 들어가게 됩니다.
    
    ```jsx
    export default function SearchBar() {
    ~~
    
    useEffect(() => {
        const getRecommendItems = async (value: string, key: string) => {
    				~~
        };
        if (!debouncedQuery) return;
        getRecommendItems(debouncedQuery, RecommendItemsStorageKey);
      }, [debouncedQuery]);
    ```
    

## **Assignment 4**

- 키보드만으로 추천 검색어들로 이동 가능하도록 구현

### 풀이 과정

1. `<Searchbar />` 안에 있는 `input` 에 키보드핸들러 이벤트를 등록한다. 추천 검색어의 인덱스를 이용해 하이라이트할 상태를 `currentIdx`로 세팅한다.
    
    ```jsx
    const [currentIdx, setCurrentIdx] = useState(0);
    ~~
    <input
      onKeyDown={onKeyDownHandler} // 키보드 핸들러
      onChange={onChangeHandler}
      id="search_bar_main"
      type="search"
      spellCheck="false"
      width="100%"
      className="css-nwra4i"
    />
    ```
    
2. 키보드가 입력될 때 화살표 위 아래 방향일 경우 `currentIdx` 에 상태변화를 준다.
    
    ```jsx
    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const maxLength = recommendItems.slice(0, 10).length;
        if (e.key === 'ArrowDown') {
          setCurrentIdx(prevIdx => (prevIdx === maxLength - 1 ? maxLength - 1 : prevIdx + 1));
        } else if (e.key === 'ArrowUp') {
          setCurrentIdx(prevIdx => (prevIdx === 0 ? 0 : prevIdx - 1));
        }
      };
    ```
    
3. 해당 `currentIdx`를 `<RecommendItems/>` 에 props로 넘겨준다.
    
    ```jsx
    <RecommendItems
      isQuerying={!!query.length}
      recommendItems={recommendItems}
      currentIdx={currentIdx}
      />
    ```
    
4. map으로 item을 돌릴 때 배열의 `idx`와 `currentIdx`를 비교하여 일치하는 경우 `true`를 `props`로 내려준다.
    
    ```jsx
    items.slice(0, 10).map((item, idx) => (
    <RecommendItem isCurrent={idx === currentIdx} key={item.id} name={item.name} />
                  ))}
    ```
    
5. props로 받은 최종 컴포넌트 `<RecommendItem />`  에서 조건에 따른 CSS 효과를 준다.
    
    ```jsx
    export  function RecommendItem({ name, isCurrent }: RecommendItemProps) {
      return (
        <div style={isCurrent ? { backgroundColor: '#e8e7e7' } : undefined}>
          ~~
        </div>
      );
    }
    ```

# 구현하지 못한 과제나 보이는 버그 부분들
1. 로컬스토리지 데이터의 expire time 주기
2. 10개 이상 데이터가 넘어갈 때 css, dom 조작으로 스크롤 효과를 주어 전부다 추천 검색어를 보여줄 수 있을 것 같은데 못하겠음
