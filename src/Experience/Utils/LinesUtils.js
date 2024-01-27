import projects from "../../../projects.json";

export function getDistance(i) {
  const projectsByDate = projects.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  const firstProject = projectsByDate[0];
  const lastProject = projectsByDate[projectsByDate.length - 1];
  const maxDistanceDate = new Date(lastProject.date) - new Date(firstProject.date);
  const project = projects[i];
  const distance = (new Date(project.date) - new Date(projectsByDate[0].date)) / maxDistanceDate;
  return distance;
}

export function getScaleY(i) {
  const project = projects[i];
  switch (project.type) {
    case "personal":
      return 0.5;
    case "pro":
      return 0.8;
    case "lab":
      return 0.3;
    case "indicator":
      return 1;
  }
}
