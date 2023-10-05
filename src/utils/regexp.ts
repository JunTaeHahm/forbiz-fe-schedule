/**
 * 일정 제목을 받아 프로젝트명과 내용을 분리해주는 함수
 * @param schTitle 일정 제목
 * @param titleTarget 프로젝트명을 제거할 일정 제목 타겟
 * @returns
 */
export const getProjectName = (schTitle: string, titleTarget?: string): { projectName: string; title: string } => {
  const match = schTitle.match(/\[(.*?)\]/);
  const projectName = match ? `[${match[1]}]` : '';

  let title: string = '';

  if (!titleTarget) {
    title = match?.input?.replace(projectName, '').trim() ?? '';
  } else {
    title = titleTarget.replace(projectName, '').trim();
  }

  return { projectName, title };
};
