import { useCallback, useState } from "react";

function useShareStatus() {
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);

  const toggleShareModalVisible = useCallback(() => {
    setShareModalVisible((prevStatus) => !prevStatus);
  }, [])

  return { shareModalVisible, toggleShareModalVisible };
}

export default useShareStatus;
