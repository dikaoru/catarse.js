import m from 'mithril';
import h from '../h';
import userVM from '../vms/user-vm';

const userHeader = {
    view(ctrl, args) {
        const user = args.user,
              profileImage = userVM.displayImage(user),
              coverImage = userVM.displayCover(user);
        return m('.hero-half', [
          m('.w-container.content-hero-profile',
                m('.w-row.u-text-center',
                    m('.w-col.w-col-8.w-col-push-2',
                      [
                          m('.u-marginbottom-20',
                                m('.avatar_wrapper',
                                    m(`img.thumb.big.u-round[alt='User'][src='${profileImage}']`)
                              )
                          ),
                          m('.fontsize-larger.fontweight-semibold.u-marginbottom-20',
                                user.name
                          ),
                          m('.w-hidden-small.w-hidden-tiny.u-marginbottom-40.fontsize-base',
                              [
                                  `Chegou junto em ${h.momentify(user.created_at, 'MMMM [de] YYYY')}`,
                                  m('br'),
                                  (user.total_contributed_projects == 0 ? 'Ainda não apoiou projetos' :
                                  `Apoiou ${h.pluralize(user.total_contributed_projects, ' projeto', ' projetos')}`),
                                  (user.total_published_projects > 0 ?
                                  ` e já criou ${h.pluralize(user.total_published_projects, ' projeto', ' projetos')}` : '')
                              ]
                          )
                      ]
                  )
              )
          ),
          m('.hero-profile', {style: `background-image:url('${coverImage}');`})
      ]
  );

    }
};

export default userHeader;
