import {CacheObject, DataFailure} from '../../cacheBase';
import {ProjectTeamEndpoints} from "@data/common/network/projectTeam.network";
import {User} from "@data/user";


interface ProjectTeamResponse {
    data: ProjectTeamInfo;
    is_successful: boolean;
    error?: string;
    trace?: string;
}

interface ProjectTeamInfo {
    projectId: string;
    client: User;
    projectLead: User;
    hackers: User[];
    validators: User[];
}

export class ProjectTeam {
    projectId: string;
    client: User;
    projectLead: User;
    hackers: User[];
    validators: User[];

    constructor(data: any) {
        this.projectId = data["projectId"];
        this.client = data["client"];
        this.projectLead = data["projectLead"];
        this.hackers = data["hackers"];
        this.validators = data["validators"]
    }
}

export class ProjectTeamCache extends CacheObject<ProjectTeam>{
    async load(projectId: string): Promise<ProjectTeam> {
        console.log(`Loading project team of project ${projectId}`);
        let res: ProjectTeamResponse;

        try {
            res = (await ProjectTeamEndpoints.getProjectTeam(projectId)) as ProjectTeamResponse;
            console.log("Cache: res.data", res.data);
        } catch (error) {
            console.log('Network error while fetching project team', error);
            throw new DataFailure('load project team', 'Network error')
        }

        if (!res.is_successful) {
            console.error('Failed to load project team:', res.error);
            throw new DataFailure('load project team', res.error ?? '');
        }

        return new ProjectTeam({...res.data});
    }
}