import m from 'mithril';
import _ from 'underscore';
import postgrest from 'mithril-postgrest';
import h from '../h';
import models from '../models';
import projectFilters from './project-filters-vm';

const idVM = h.idVM,
      userDetails = m.prop([]),
      currentUser = m.prop(),
      createdVM = postgrest.filtersVM({project_user_id: 'eq'});

const getUserCreatedProjects = (user_id, pageSize = 3) => {
    createdVM.project_user_id(user_id).order({project_id: 'desc'});

    models.project.pageSize(pageSize);

    const lUserCreated = postgrest.loaderWithToken(models.project.getPageOptions(createdVM.parameters()));

    return lUserCreated.load();
};

const getPublicUserContributedProjects = (user_id, pageSize = 3) => {
    const contextVM = postgrest.filtersVM({
        user_id: 'eq'
    });

    contextVM.user_id(user_id);

    models.contributor.pageSize(pageSize);

    const lUserContributed = postgrest.loaderWithToken(
        models.contributor.getPageOptions(contextVM.parameters()));

    return lUserContributed.load();
};

const getUserContributedProjects = (user_id, pageSize = 3) => {
    const contextVM = postgrest.filtersVM({
        user_id: 'eq',
        state: 'in'
    });

    contextVM.user_id(user_id).order({
        created_at: 'desc'
    }).state(['refunded', 'pending_refund', 'paid']);

    models.userContribution.pageSize(pageSize);

    const lUserContributed = postgrest.loaderWithToken(
        models.userContribution.getPageOptions(contextVM.parameters()));

    return lUserContributed.load();
};

const fetchUser = (user_id, handlePromise = true, customProp = currentUser) => {
    idVM.id(user_id);

    const lUser = postgrest.loaderWithToken(models.userDetail.getRowOptions(idVM.parameters()));

    return !handlePromise ? lUser.load() : lUser.load().then(_.compose(customProp, _.first));
};


const displayImage = (user) => {
  return user.profile_img_thumbnail || "https://catarse.me/assets/catarse_bootstrap/user.jpg";
};

const displayCover = (user) => user.profile_cover_image || displayImage(user);

const getUserRecommendedProjects = (contribution) => {
    const sample3 = _.partial(_.sample, _, 3),
        loaders = m.prop([]),
        collection = m.prop([]),
        {user_id} = h.getUser();

    const loader = () => {
        return _.reduce(loaders(), (memo, curr) => {
            const _memo = _.isFunction(memo) ? memo() : memo,
                _curr = _.isFunction(curr) ? curr() : curr;

            return _memo && _curr;
        }, true);
    };

    const loadPopular = () => {
        const filters = projectFilters().filters;
        const popular = postgrest.loaderWithToken(
            models.project.getPageOptions(
                _.extend({}, {order: 'score.desc'}, filters['score'].filter.parameters())
            )
        );

        loaders().push(popular);

        popular.load().then(_.compose(collection, sample3));
    };

    const pushProject = ({project_id}) => {
        const project = postgrest.loaderWithToken(
            models.project.getPageOptions(
                postgrest.filtersVM({project_id: 'eq'})
                    .project_id(project_id)
                    .parameters()
            )
        );

        loaders().push(project)
        project.load().then((data) => {
            collection().push(_.first(data));
        });
    };

    const projects = postgrest.loaderWithToken(
        models.recommendedProjects.getPageOptions(
            postgrest.filtersVM({user_id: 'eq'})
                .user_id(user_id)
                .parameters()
        )
    );



    projects.load().then(recommended => {
        console.log('Recommended response is: ', recommended)
        if(recommended.length > 0) {
            _.map(recommended, pushProject)
        } else {
            loadPopular();
        }
    });

    return {
        loader: loader,
        collection: collection
    };
};

const userVM = {
    getUserCreatedProjects: getUserCreatedProjects,
    getUserRecommendedProjects: getUserRecommendedProjects,
    getUserContributedProjects: getUserContributedProjects,
    getPublicUserContributedProjects: getPublicUserContributedProjects,
    currentUser: currentUser,
    displayImage: displayImage,
    displayCover: displayCover,
    fetchUser: fetchUser
};

export default userVM;
