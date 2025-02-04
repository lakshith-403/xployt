import { Quark, QuarkFunction } from '@/ui_lib/quark';
import { View } from '@/ui_lib/view';
import { ProjectsCache } from '@/data/validator/cache/projects.cache'; // Import the ProjectsCache
import { Project } from '@/data/validator/cache/projects.cache'; // Import the Project model
import LoadingScreen from '@/components/loadingScreen/loadingScreen';

class ProjectLeadDashboard extends View {
    private projectsCache: ProjectsCache;
    private projects: Project[] = [];
    private loading: boolean = true;
    private error: string | null = null;

    constructor() {
        super();
        this.projectsCache = new ProjectsCache(); // Initialize the ProjectsCache
    }

    public async render(q: Quark): Promise<void> {
        const loading = new LoadingScreen(q);
        loading.show();

        try {
            const userId = 1; // Replace with actual user ID logic
            this.projects = await this.projectsCache.load(userId); // Load projects from cache
        } catch (err) {
            this.error = 'Error fetching projects';
            console.error(this.error, err);
        } finally {
            this.loading = false;
            loading.hide();
        }

        // Clear existing content
        q.innerHTML = '';

        // Create header
        QuarkFunction(q, 'h1', '', {}, 'Project Lead Dashboard');

        // Create loading/error message
        if (this.loading) {
            QuarkFunction(q, 'div', '', {}, 'Loading...');
        } else if (this.error) {
            QuarkFunction(q, 'div', '', {}, this.error);
        } else {
            // Create table
            const table = QuarkFunction(q, 'table', '', {});
            const thead = QuarkFunction(table, 'thead', '', {});
            const tbody = QuarkFunction(table, 'tbody', '', {});

            // Create table header
            const headerRow = QuarkFunction(thead, 'tr', '', {});
            QuarkFunction(headerRow, 'th', '', {}, 'Project ID');
            QuarkFunction(headerRow, 'th', '', {}, 'Title');
            QuarkFunction(headerRow, 'th', '', {}, 'Status');
            QuarkFunction(headerRow, 'th', '', {}, 'Actions');

            // Populate table rows
            this.projects.forEach(project => {
                const row = QuarkFunction(tbody, 'tr', '', {});
                QuarkFunction(row, 'td', '', {}, project.id);
                QuarkFunction(row, 'td', '', {}, project.title);
                QuarkFunction(row, 'td', '', {}, project.status);
                const actionsCell = QuarkFunction(row, 'td', '', {});

                QuarkFunction(actionsCell, 'button', '', {
                    onclick: () => this.handleAccept(project.id)
                }, 'Accept');
                QuarkFunction(actionsCell, 'button', '', {
                    onclick: () => this.handleReject(project.id)
                }, 'Reject');
            });
        }
    }

    private async handleAccept(projectId: number) {
        try {
            // Call the accept project API
            await axios.post(`/api/lead/initiate/project/accept/${projectId}`);
            // Update the project status in the cache
            this.projectsCache.updateProject(projectId, 'Active'); // Update status as needed
            await this.render(document.getElementById('content')!); // Re-render the dashboard
        } catch (err) {
            this.error = 'Error accepting project';
            console.error(this.error, err);
        }
    }

    private async handleReject(projectId: number) {
        try {
            // Call the reject project API
            await axios.post(`/api/lead/initiate/project/reject/${projectId}`);
            // Update the project status in the cache
            this.projectsCache.updateProject(projectId, 'Rejected'); // Update status as needed
            await this.render(document.getElementById('content')!); // Re-render the dashboard
        } catch (err) {
            this.error = 'Error rejecting project';
            console.error(this.error, err);
        }
    }
}

export default ProjectLeadDashboard;