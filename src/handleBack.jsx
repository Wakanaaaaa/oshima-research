// handleBack関数を純粋な関数として定義し、routerオブジェクトを引数として渡す
export const handleBack = (router) => {
  const goBack = () => {
    router.back(); // Linkの代わりにrouter.back()を使用して戻る
  };

  return { goBack };
};

