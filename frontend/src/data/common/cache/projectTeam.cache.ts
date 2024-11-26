import {CacheObject, DataFailure} from '../../cacheBase';
import {ProjectTeamEndpoints} from "@data/common/network/projectTeam.network";
import {PublicUser} from "@data/user";


interface ProjectTeamResponse {
    data: ProjectTeamInfo;
    is_successful: boolean;
    error?: string;
    trace?: string;
}

interface ProjectTeamInfo {
    projectId: string;
    client: PublicUser;
    projectLead: PublicUser;
    hackers: PublicUser[];
    validators: PublicUser[];
}

export class ProjectTeam {
    projectId: string;
    client: PublicUser;
    projectLead: PublicUser;
    hackers: PublicUser[];
    validators: PublicUser[];

    constructor(data: any) {
        this.projectId = data["projectId"];
        this.client = new PublicUser(data["client"]);
        this.projectLead = new PublicUser(data["projectLead"]);
        this.hackers = data['projectHackers'].map((hacker: any) => new PublicUser(hacker));
        this.validators = data['projectValidators'].map((validator: any) => new PublicUser(validator));
    }

    public getClientWithoutId(): { name: string; email: string } {
        return this.client.removeId();
    }

    public getProjectLeadWithoutId(): { name: string; email: string } {
        return this.projectLead.removeId();
    }

    public getHackersWithoutId(): { name: string; email: string }[] {
        return this.hackers.map(hacker => hacker.removeId());
    }

    public getValidatorsWithoutId(): { name: string; email: string }[] {
        return this.validators.map(validator => validator.removeId());
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