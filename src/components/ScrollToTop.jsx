import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType(); // 현재 라우팅 액션 타입 감지

  useEffect(() => {
    // 'POP'은 브라우저의 뒤로 가기/앞으로 가기를 의미합니다.
    // 뒤로 가기가 아닐 때(새로운 링크 클릭 시)만 스크롤을 맨 위로 올립니다.
    if (navType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);

  return null;
}
